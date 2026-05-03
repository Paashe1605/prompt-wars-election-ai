from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import functools
import logging
from election_agent import get_election_info

# Initialize Google Cloud Telemetry for Enterprise Analytics
try:
    import google.cloud.logging
    from google.cloud import monitoring_v3
    logging_client = google.cloud.logging.Client()
    logging_client.setup_logging()
except Exception:
    logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Election Guide API", version="2.0.0")

# Efficiency: Compress responses for low-bandwidth users
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Security: Enable CORS fully
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security: Advanced HTTP Headers
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

class ElectionGuideRequest(BaseModel):
    latitude: float
    longitude: float
    language: str

# Efficiency: LRU Cache prevents repeated external API calls
@functools.lru_cache(maxsize=128)
def reverse_geocode(lat: float, lon: float) -> str:
    """
    Converts latitude and longitude into a string location (City, State, Country).
    Falls back to 'General Global' if geocoding fails.
    """
    try:
        geolocator = Nominatim(user_agent="hack2skill-election-agent")
        location = geolocator.reverse(f"{lat}, {lon}", exactly_one=True)
        if location and location.address:
            # We could parse the address dictionary to get specifically City, State, Country
            # But returning the full address string or a subset is usually fine.
            address = location.raw.get('address', {})
            city = address.get('city', address.get('town', address.get('village', '')))
            state = address.get('state', '')
            country = address.get('country', '')
            
            parts = [p for p in [city, state, country] if p]
            if parts:
                return ", ".join(parts)
            return location.address
        return "General Global"
    except (GeocoderTimedOut, GeocoderServiceError, Exception) as e:
        print(f"Geocoding error: {e}")
        return "General Global"

import json
import base64
import io
from gtts import gTTS

# Language mapping for gTTS
LANG_MAP = {
    "English": "en",
    "Hindi": "hi",
    "Gujarati": "gu",
    "Marathi": "mr",
    "Tamil": "ta",
    "Telugu": "te",
    "Bengali": "bn",
    "Kannada": "kn",
    "Malayalam": "ml",
    "Punjabi": "pa",
    "Spanish": "es",
    "French": "fr",
    "German": "de"
}

@app.post("/api/election-guide")
def election_guide(request: ElectionGuideRequest):
    location_str = reverse_geocode(request.latitude, request.longitude)
    
    try:
        grounded_response = get_election_info(location_str, request.language)
        audio_base64 = None
        audio_base64_voting = None
        audio_base64_politics = None
        try:
            parsed_response = json.loads(grounded_response)
            
            # Generate TTS audio
            audio_text = parsed_response.get("audio_summary", "")
            tts_lang = LANG_MAP.get(request.language, "en") # default to English
            if audio_text:
                tts = gTTS(text=audio_text, lang=tts_lang, slow=False)
                
                fp = io.BytesIO()
                tts.write_to_fp(fp)
                fp.seek(0)
                audio_base64 = base64.b64encode(fp.read()).decode('utf-8')
                
            audio_voting = parsed_response.get("audio_voting_procedures", "")
            if audio_voting:
                tts = gTTS(text=audio_voting, lang=tts_lang, slow=False)
                fp = io.BytesIO()
                tts.write_to_fp(fp)
                fp.seek(0)
                audio_base64_voting = base64.b64encode(fp.read()).decode('utf-8')
                
            audio_politics = parsed_response.get("audio_political_landscape", "")
            if audio_politics:
                tts = gTTS(text=audio_politics, lang=tts_lang, slow=False)
                fp = io.BytesIO()
                tts.write_to_fp(fp)
                fp.seek(0)
                audio_base64_politics = base64.b64encode(fp.read()).decode('utf-8')
                
        except json.JSONDecodeError:
            parsed_response = {"error": "Failed to parse AI response as JSON", "raw_output": grounded_response}
            
        response_payload = {
            "response": parsed_response,
            "location_identified": location_str,
            "audio_base64": f"data:audio/mp3;base64,{audio_base64}" if audio_base64 else None,
            "audio_base64_voting": f"data:audio/mp3;base64,{audio_base64_voting}" if audio_base64_voting else None,
            "audio_base64_politics": f"data:audio/mp3;base64,{audio_base64_politics}" if audio_base64_politics else None
        }
        return response_payload
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/location")
def get_location(lat: float, lon: float):
    location_str = reverse_geocode(lat, lon)
    return {"location": location_str}

# Serve React Frontend
if os.path.isdir("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return FileResponse("static/index.html")
