from google import genai
from google.genai import types
from google.genai.types import Schema, Type

# Initialize the new standard Gen AI client for Vertex AI
client = genai.Client(vertexai=True, project='election-agent-h2s', location='global')

def get_election_info(location: str, language: str) -> str:
    """
    Acts as a non-partisan global election education assistant.
    Uses Google Search grounding to return real-time upcoming election timelines,
    voting steps, and educational data specific to the location, translated into the language.
    """
    system_instruction = (
        "You are a non-partisan global election education assistant. "
        "Your goal is to provide accurate, unbiased, and helpful information about elections, voting procedures, "
        "and educational data related to elections. You must rely on factual information retrieved via Google Search "
        "to provide real-time updates. You MUST include at least one relevant educational YouTube video link in the resources array."
    )
    
    prompt = (
        f"Location: {location}\n"
        f"Requested Language: {language}\n\n"
        "Please provide the following information:\n"
        "1. Upcoming election timelines for this location.\n"
        "2. Step-by-step voting instructions and requirements.\n"
        "3. Relevant non-partisan educational data about the electoral process.\n"
        "Ensure the entire response is natively translated into the requested language."
    )
    
    response_schema = Schema(
        type=Type.OBJECT,
        properties={
            "audio_summary": Schema(
                type=Type.STRING,
                description="A concise, 2-3 sentence overview of the election situation perfect for text-to-speech."
            ),
            "timeline": Schema(
                type=Type.STRING,
                description="Markdown formatted election timelines."
            ),
            "next_election_date": Schema(
                type=Type.STRING,
                description="The date of the next upcoming election in ISO format YYYY-MM-DD. If the exact day is unknown, estimate the year and month based on historical terms (e.g., '2027-12-01'). NEVER return 'Unknown'."
            ),
            "voting_steps": Schema(
                type=Type.ARRAY,
                description="Step-by-step voting instructions.",
                items=Schema(
                    type=Type.OBJECT,
                    properties={
                        "step_number": Schema(type=Type.INTEGER),
                        "title": Schema(type=Type.STRING),
                        "description": Schema(type=Type.STRING)
                    },
                    required=["step_number", "title", "description"]
                )
            ),
            "resources": Schema(
                type=Type.ARRAY,
                items=Schema(
                    type=Type.OBJECT,
                    properties={
                        "title": Schema(type=Type.STRING),
                        "url": Schema(type=Type.STRING),
                        "type": Schema(
                            type=Type.STRING,
                            description="Must be one of: 'youtube', 'official', or 'news'."
                        )
                    },
                    required=["title", "url", "type"]
                )
            )
        },
        required=["audio_summary", "timeline", "next_election_date", "voting_steps", "resources"]
    )
    
    response = client.models.generate_content(
        model='gemini-3.1-pro-preview',
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=[types.Tool(google_search=types.GoogleSearch())],
            response_mime_type="application/json",
            response_schema=response_schema
        )
    )
    
    return response.text