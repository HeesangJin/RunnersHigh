from sqlalchemy import Column, Integer, String, Float, ForeignKey, Time, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Result(Base):
    id = Column(Integer, primary_key=True, index=True)
    runner_id = Column(Integer, ForeignKey("runner.id"))
    race_id = Column(Integer, ForeignKey("race.id"))
    finish_time = Column(Time, index=True)  # 완주 시간
    overall_rank = Column(Integer, nullable=True)  # 전체 순위
    age_group_rank = Column(Integer, nullable=True)  # 연령대 순위
    gender_rank = Column(Integer, nullable=True)  # 성별 순위
    bib_number = Column(String, nullable=True)  # 배번
    pace = Column(Float, nullable=True)  # min/km
    notes = Column(Text, nullable=True)
    
    # 관계 설정
    runner = relationship("Runner", back_populates="results")
    race = relationship("Race", back_populates="results")
