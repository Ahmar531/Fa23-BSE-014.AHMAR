from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import Boolean, Integer, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column

from database import Base, get_db, init_db

app = FastAPI(
    title="Task API",
    version="1.0",
    description="A PostgreSQL-backed CRUD API for managing to-do tasks.",
)


class TaskRecord(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    done: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class Task(BaseModel):
    id: int
    title: str
    done: bool = False

    model_config = ConfigDict(from_attributes=True)


class TaskCreate(BaseModel):
    title: str = Field(min_length=1)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1)
    done: Optional[bool] = None


init_db()


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
async def list_tasks(db: Session = Depends(get_db)) -> list[TaskRecord]:
    return list(db.scalars(select(TaskRecord).order_by(TaskRecord.id)).all())


@app.get("/tasks/{task_id}", response_model=Task, tags=["Tasks"])
async def get_task(task_id: int, db: Session = Depends(get_db)) -> TaskRecord:
    task = db.get(TaskRecord, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return task


@app.post("/tasks", response_model=Task, status_code=201, tags=["Tasks"])
async def create_task(
    task_input: TaskCreate, db: Session = Depends(get_db)
) -> TaskRecord:
    title = task_input.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Task title cannot be empty")
    task = TaskRecord(title=title, done=False)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.put("/tasks/{task_id}", response_model=Task, tags=["Tasks"])
async def update_task(
    task_id: int, task_input: TaskUpdate, db: Session = Depends(get_db)
) -> TaskRecord:
    if not task_input.model_fields_set:
        raise HTTPException(status_code=400, detail="Update body cannot be empty")

    task = db.get(TaskRecord, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    if task_input.title is not None:
        title = task_input.title.strip()
        if not title:
            raise HTTPException(status_code=400, detail="Task title cannot be empty")
        task.title = title
    if task_input.done is not None:
        task.done = task_input.done
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=204, tags=["Tasks"])
async def delete_task(task_id: int, db: Session = Depends(get_db)) -> None:
    task = db.get(TaskRecord, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    db.delete(task)
    db.commit()
