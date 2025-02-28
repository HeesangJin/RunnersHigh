from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Runner])
def read_runners(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    모든 러너(마라토너) 목록 조회
    """
    runners = crud.runner.get_multi(db, skip=skip, limit=limit)
    return runners

@router.post("/", response_model=schemas.Runner)
def create_runner(
    *,
    db: Session = Depends(deps.get_db),
    runner_in: schemas.RunnerCreate,
) -> Any:
    """
    새 러너(마라토너) 생성
    """
    runner = crud.runner.create(db=db, obj_in=runner_in)
    return runner

@router.get("/{runner_id}", response_model=schemas.RunnerWithResults)
def read_runner(
    *,
    db: Session = Depends(deps.get_db),
    runner_id: int,
) -> Any:
    """
    특정 러너(마라토너)의 상세 정보와 경기 결과 조회
    """
    runner = crud.runner.get(db=db, id=runner_id)
    if not runner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Runner not found",
        )
    return runner

@router.put("/{runner_id}", response_model=schemas.Runner)
def update_runner(
    *,
    db: Session = Depends(deps.get_db),
    runner_id: int,
    runner_in: schemas.RunnerUpdate,
) -> Any:
    """
    러너(마라토너) 정보 업데이트
    """
    runner = crud.runner.get(db=db, id=runner_id)
    if not runner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Runner not found",
        )
    runner = crud.runner.update(db=db, db_obj=runner, obj_in=runner_in)
    return runner

@router.delete("/{runner_id}", response_model=schemas.Runner)
def delete_runner(
    *,
    db: Session = Depends(deps.get_db),
    runner_id: int,
) -> Any:
    """
    러너(마라토너) 삭제
    """
    runner = crud.runner.get(db=db, id=runner_id)
    if not runner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Runner not found",
        )
    runner = crud.runner.remove(db=db, id=runner_id)
    return runner
