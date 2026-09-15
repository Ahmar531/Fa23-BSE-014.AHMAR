from fastapi.testclient import TestClient

from main import Task, app, tasks


client = TestClient(app)


def reset_tasks() -> None:
    tasks.clear()
    tasks.extend(
        [
            Task(id=1, title="Read the assignment", done=True),
            Task(id=2, title="Build the API", done=False),
            Task(id=3, title="Test the endpoints", done=False),
        ]
    )


def setup_function() -> None:
    reset_tasks()


def test_info_and_health_endpoints() -> None:
    assert client.get("/").status_code == 200
    assert client.get("/health").json() == {"status": "ok"}


def test_full_crud_cycle() -> None:
    created = client.post("/tasks", json={"title": "Buy milk"})
    assert created.status_code == 201
    task_id = created.json()["id"]

    assert client.get(f"/tasks/{task_id}").json()["title"] == "Buy milk"

    updated = client.put(f"/tasks/{task_id}", json={"done": True})
    assert updated.status_code == 200
    assert updated.json()["done"] is True

    deleted = client.delete(f"/tasks/{task_id}")
    assert deleted.status_code == 204
    assert client.get(f"/tasks/{task_id}").status_code == 404


def test_invalid_input_and_missing_tasks() -> None:
    assert client.post("/tasks", json={}).status_code == 400
    assert client.post("/tasks", json={"title": "   "}).status_code == 400
    assert client.put("/tasks/1", json={}).status_code == 400
    assert client.get("/tasks/99").status_code == 404
    assert client.delete("/tasks/99").status_code == 404


def test_swagger_ui_is_available() -> None:
    response = client.get("/docs")
    assert response.status_code == 200
    assert "swagger-ui" in response.text
