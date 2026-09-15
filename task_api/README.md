# Task API

A small in-memory CRUD API built with Python and FastAPI for the BE-01 Week 2 assignment.

## Run locally

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload
```

Open Swagger UI at <http://localhost:8000/docs>.

The data is stored only in memory, so it resets to the three example tasks whenever the server restarts.

## Endpoints

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| GET | `/` | API information | 200 |
| GET | `/health` | Health check | 200 |
| GET | `/tasks` | List all tasks | 200 |
| GET | `/tasks/{id}` | Get one task | 200 |
| POST | `/tasks` | Create a task | 201 |
| PUT | `/tasks/{id}` | Update a task title and/or status | 200 |
| DELETE | `/tasks/{id}` | Delete a task | 204 |

Invalid request bodies return `400`. Unknown task IDs return `404` with an error message.

## Example requests

Create a task:

```powershell
curl.exe -i -X POST http://localhost:8000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
```

Example response:

```text
HTTP/1.1 201 Created
content-type: application/json

{"id":4,"title":"Buy milk","done":false}
```

Update and delete:

```powershell
curl.exe -i -X PUT http://localhost:8000/tasks/4 -H "Content-Type: application/json" -d '{"done":true}'
curl.exe -i -X DELETE http://localhost:8000/tasks/4
```

## Test

```powershell
py -m pytest
```

## GitHub submission

Create one meaningful commit for each assignment stage:

```powershell
git init
git add .
git commit -m "Stage 0: hello server"
git commit --allow-empty -m "Stage 1: root and health endpoints"
git commit --allow-empty -m "Stage 2: read endpoints with 404"
git commit --allow-empty -m "Stage 3: create with validation"
git commit --allow-empty -m "Stage 4: full CRUD"
git commit --allow-empty -m "Stage 5: Swagger UI"
git commit --allow-empty -m "Stage 6: publish and docs"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-api.git
git push -u origin main
```

Replace `YOUR_USERNAME` and the repository name with your public GitHub repository details.
