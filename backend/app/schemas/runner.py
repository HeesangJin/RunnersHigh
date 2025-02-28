from typing import List, Optional
from datetime import date
from pydantic import BaseModel

from app.schemas.result import Result


# 공통 속성
class RunnerBase(BaseModel):
    name: str
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    profile_image: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    bio: Optional[str] = None


# 생성 시 사용
class RunnerCreate(RunnerBase):
    pass


# 업데이트 시 사용
class RunnerUpdate(RunnerBase):
    name: Optional[str] = None


# DB에서 읽어올 때 사용 (기본)
class Runner(RunnerBase):
    id: int

    class Config:
        orm_mode = True


# 결과 포함하여 읽어올 때 사용
class RunnerWithResults(Runner):
    results: List[Result] = []
