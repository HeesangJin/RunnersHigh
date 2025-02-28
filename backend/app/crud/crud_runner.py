from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.runner import Runner
from app.schemas.runner import RunnerCreate, RunnerUpdate


class CRUDRunner(CRUDBase[Runner, RunnerCreate, RunnerUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Runner]:
        """
        이름으로 러너 검색
        """
        return db.query(Runner).filter(Runner.name == name).first()
    
    def get_multi_by_nationality(
        self, db: Session, *, nationality: str, skip: int = 0, limit: int = 100
    ) -> List[Runner]:
        """
        국적으로 러너 목록 검색
        """
        return (
            db.query(Runner)
            .filter(Runner.nationality == nationality)
            .offset(skip)
            .limit(limit)
            .all()
        )


runner = CRUDRunner(Runner)
