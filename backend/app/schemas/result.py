from typing import Optional
from datetime import time
from pydantic import BaseModel


# 공통 속성
class ResultBase(BaseModel):
    runner_id: int
    race_id: int
    finish_time: time
    overall_rank: Optional[int] = None
    age_group_rank: Optional[int] = None
    gender_rank: Optional[int] = None
    bib_number: Optional[str] = None
    pace: Optional[float] = None
    notes: Optional[str] = None


# 생성 시 사용
class ResultCreate(ResultBase):
    pass


# 업데이트 시 사용
class ResultUpdate(ResultBase):
    runner_id: Optional[int] = None
    race_id: Optional[int] = None
    finish_time: Optional[time] = None


# DB에서 읽어올 때 사용 (기본)
class Result(ResultBase):
    id: int

    class Config:
        orm_mode = True


# 상세 정보 포함하여 읽어올 때 사용
class ResultDetail(Result):
    # 여기서는 runner와 race 관계를 포함하지 않습니다.
    # 순환 참조 문제를 방지하기 위해 별도의 Pydantic 모델을 정의할 수 있습니다.
    pass
