from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.result import Result
from app.schemas.result import ResultCreate, ResultUpdate


class CRUDResult(CRUDBase[Result, ResultCreate, ResultUpdate]):
    def get_by_runner_and_race(
        self, db: Session, *, runner_id: int, race_id: int
    ) -> Optional[Result]:
        """
        특정 러너와 레이스 조합으로 결과 검색
        """
        return (
            db.query(Result)
            .filter(Result.runner_id == runner_id, Result.race_id == race_id)
            .first()
        )
    
    def get_multi_by_runner(
        self, db: Session, *, runner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Result]:
        """
        특정 러너의 모든 결과 검색
        """
        return (
            db.query(Result)
            .filter(Result.runner_id == runner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_multi_by_race(
        self, db: Session, *, race_id: int, skip: int = 0, limit: int = 100
    ) -> List[Result]:
        """
        특정 레이스의 모든 결과 검색
        """
        return (
            db.query(Result)
            .filter(Result.race_id == race_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_top_results_by_race(
        self, db: Session, *, race_id: int, limit: int = 10
    ) -> List[Result]:
        """
        특정 레이스의 상위 결과 검색 (상위 N명)
        """
        return (
            db.query(Result)
            .filter(Result.race_id == race_id)
            .order_by(Result.finish_time)
            .limit(limit)
            .all()
        )


result = CRUDResult(Result)
