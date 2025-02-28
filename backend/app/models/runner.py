from sqlalchemy import Column, Integer, String, Date, Float, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Runner(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    birth_date = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    nationality = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    height = Column(Float, nullable=True)  # cm
    weight = Column(Float, nullable=True)  # kg
    bio = Column(Text, nullable=True)
    
    # 관계 설정
    results = relationship("Result", back_populates="runner", cascade="all, delete-orphan")
