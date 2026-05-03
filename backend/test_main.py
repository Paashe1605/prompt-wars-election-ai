from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_location_fallback():
    # Test the location endpoint with generic coordinates
    response = client.get("/api/location?lat=0.0&lon=0.0")
    assert response.status_code == 200
    assert "location" in response.json()

def test_cors_headers():
    # Test that CORS is enabled for frontend communication
    response = client.options("/api/election-guide")
    assert response.status_code == 200