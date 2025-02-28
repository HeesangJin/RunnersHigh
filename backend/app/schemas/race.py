from typing import List, Optional
from datetime import date
from pydantic import BaseModel

from app.schemas.result import Result


# 공통 속성
class RaceBase(BaseModel):
    name: str
    date: date
    location: str
    distance: float
    elevation_gain: Optional[float] = None
    type: str
    description: Optional[str] = None
    is_official: bool = True


# 생성 시 사용
class RaceCreate(RaceBase):
    pass


# 업데이트 시 사용
class RaceUpdate(RaceBase):
    name: Optional[str] = None
    date: Optional[date] = None
    location: Optional[str] = None
    distance: Optional[float] = None
    type: Optional[str] = None


# DB에서 읽어올 때 사용 (기본)
class Race(RaceBase):
    id: int

    class Config:
        orm_mode = True


# 결과 포함하여 읽어올 때 사용
class RaceWithResults(Race):
    results: List[Result] = []
