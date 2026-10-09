from fastapi.testclient import TestClient
from app.main import app

def test_health():
    # Uses configured database at app startup; run with local PostgreSQL available.
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

def test_docs_available():
    with TestClient(app) as client:
        response = client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert "/api/auth/register" in schema["paths"]
        assert "/api/resumes/generate" in schema["paths"]
