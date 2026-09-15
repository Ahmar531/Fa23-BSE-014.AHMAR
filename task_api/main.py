from typing import Optional

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

app = FastAPI(
    title="Task API",
    version="1.0",
    description="An in-memory CRUD API for managing to-do tasks.",
)


class Task(BaseModel):
    id: int
    title: str
    done: bool = False


class TaskCreate(BaseModel):
    title: str = Field(min_length=1)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1)
    done: Optional[bool] = None


tasks: list[Task] = [
    Task(id=1, title="Read the assignment", done=True),
    Task(id=2, title="Build the API", done=False),
    Task(id=3, title="Test the endpoints", done=False),
]


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"error": "Invalid request: check the JSON body and path parameters."},
    )


@app.get("/", tags=["Info"])
async def root() -> dict:
    return {"name": "Task API", "version": "1.0", "endpoints": ["/tasks"]}


@app.get("/health", tags=["Info"])
async def health() -> dict:
    return {"status": "ok"}


@app.get("/tasks", response_model=list[Task], tags=["Tasks"])
async def list_tasks() -> list[Task]:
    return tasks


@app.get("/tasks/{task_id}", response_model=Task, tags=["Tasks"])
async def get_task(task_id: int) -> Task:
    task = next((item for item in tasks if item.id == task_id), None)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return task


@app.post("/tasks", response_model=Task, status_code=201, tags=["Tasks"])
async def create_task(task_input: TaskCreate) -> Task:
    next_id = max((task.id for task in tasks), default=0) + 1
    task = Task(id=next_id, title=task_input.title.strip(), done=False)
    if not task.title:
        raise HTTPException(status_code=400, detail="Task title cannot be empty")
    tasks.append(task)
    return task


@app.put("/tasks/{task_id}", response_model=Task, tags=["Tasks"])
async def update_task(task_id: int, task_input: TaskUpdate) -> Task:
    if not task_input.model_fields_set:
        raise HTTPException(status_code=400, detail="Update body cannot be empty")

    task = next((item for item in tasks if item.id == task_id), None)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    if task_input.title is not None:
        title = task_input.title.strip()
        if not title:
            raise HTTPException(status_code=400, detail="Task title cannot be empty")
        task.title = title
    if task_input.done is not None:
        task.done = task_input.done
    return task


@app.delete("/tasks/{task_id}", status_code=204, tags=["Tasks"])
async def delete_task(task_id: int) -> None:
    task_index = next(
        (index for index, task in enumerate(tasks) if task.id == task_id), None
    )
    if task_index is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    tasks.pop(task_index)
