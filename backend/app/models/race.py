from sqlalchemy import Column, Integer, String, Date, Float, Text, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Race(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(Date, index=True)
    location = Column(String, index=True)
    distance = Column(Float)  # km
    elevation_gain = Column(Float, nullable=True)  # m
    type = Column(String, index=True)  # 마라톤, 하프 마라톤, 10K, 5K 등
    description = Column(Text, nullable=True)
    is_official = Column(Boolean, default=True)
    
    # 관계 설정
    results = relationship("Result", back_populates="race", cascade="all, delete-orphan")
