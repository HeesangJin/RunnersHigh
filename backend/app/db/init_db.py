import logging

from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import base  # noqa: F401

logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    """
    데이터베이스 초기화 및 기본 데이터 생성
    """
    # 여기에 초기 데이터를 생성하는 코드를 추가할 수 있습니다
    # 예: 기본 관리자 계정, 테스트 데이터 등
    pass
