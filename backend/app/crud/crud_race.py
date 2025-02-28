from typing import List, Optional
from datetime import date

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.race import Race
from app.schemas.race import RaceCreate, RaceUpdate


class CRUDRace(CRUDBase[Race, RaceCreate, RaceUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Race]:
        """
        이름으로 레이스 검색
        """
        return db.query(Race).filter(Race.name == name).first()
    
    def get_multi_by_location(
        self, db: Session, *, location: str, skip: int = 0, limit: int = 100
    ) -> List[Race]:
        """
        위치로 레이스 목록 검색
        """
        return (
            db.query(Race)
            .filter(Race.location == location)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_multi_by_date_range(
        self, db: Session, *, start_date: date, end_date: date, skip: int = 0, limit: int = 100
    ) -> List[Race]:
        """
        날짜 범위로 레이스 목록 검색
        """
        return (
            db.query(Race)
            .filter(Race.date >= start_date, Race.date <= end_date)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_multi_by_type(
        self, db: Session, *, race_type: str, skip: int = 0, limit: int = 100
    ) -> List[Race]:
        """
        레이스 타입으로 목록 검색 (마라톤, 하프 마라톤, 10K 등)
        """
        return (
            db.query(Race)
            .filter(Race.type == race_type)
            .offset(skip)
            .limit(limit)
            .all()
        )


race = CRUDRace(Race)
