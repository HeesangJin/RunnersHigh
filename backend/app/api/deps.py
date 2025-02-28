from typing import Generator

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import SessionLocal

def get_db() -> Generator:
    """
    데이터베이스 세션을 제공하는 의존성 함수
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
