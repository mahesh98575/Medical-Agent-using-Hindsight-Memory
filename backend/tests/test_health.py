"""Health check and root endpoint tests."""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify the root endpoint returns correct application metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Healthcare Memory Assistant API"
    assert data["status"] == "online"
    assert data["synthetic_mode"] is True


def test_health_endpoint():
    """Verify the health endpoint reports healthy status and active services."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "environment" in data
    assert "services" in data
    assert data["services"]["api"] == "operational"
    assert data["synthetic_mode"] is True
