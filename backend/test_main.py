from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_location_success():
    response = client.get("/api/location?lat=22.5645&lon=72.9289")
    assert response.status_code == 200
    assert "location" in response.json()

def test_get_location_fallback():
    response = client.get("/api/location?lat=0.0&lon=0.0")
    assert response.status_code == 200

def test_cors_headers():
    response = client.options("/api/election-guide")
    assert response.status_code == 200

def test_election_guide_validation_error():
    response = client.post("/api/election-guide", json={"latitude": 22.5645}) 
    assert response.status_code == 422