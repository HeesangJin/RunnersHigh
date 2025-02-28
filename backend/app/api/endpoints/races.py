from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Race])
def read_races(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    모든 대회(레이스) 목록 조회
    """
    races = crud.race.get_multi(db, skip=skip, limit=limit)
    return races

@router.post("/", response_model=schemas.Race)
def create_race(
    *,
    db: Session = Depends(deps.get_db),
    race_in: schemas.RaceCreate,
) -> Any:
    """
    새 대회(레이스) 생성
    """
    race = crud.race.create(db=db, obj_in=race_in)
    return race

@router.get("/{race_id}", response_model=schemas.RaceWithResults)
def read_race(
    *,
    db: Session = Depends(deps.get_db),
    race_id: int,
) -> Any:
    """
    특정 대회(레이스)의 상세 정보와 결과 조회
    """
    race = crud.race.get(db=db, id=race_id)
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Race not found",
        )
    return race

@router.put("/{race_id}", response_model=schemas.Race)
def update_race(
    *,
    db: Session = Depends(deps.get_db),
    race_id: int,
    race_in: schemas.RaceUpdate,
) -> Any:
    """
    대회(레이스) 정보 업데이트
    """
    race = crud.race.get(db=db, id=race_id)
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Race not found",
        )
    race = crud.race.update(db=db, db_obj=race, obj_in=race_in)
    return race

@router.delete("/{race_id}", response_model=schemas.Race)
def delete_race(
    *,
    db: Session = Depends(deps.get_db),
    race_id: int,
) -> Any:
    """
    대회(레이스) 삭제
    """
    race = crud.race.get(db=db, id=race_id)
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Race not found",
        )
    race = crud.race.remove(db=db, id=race_id)
    return race
