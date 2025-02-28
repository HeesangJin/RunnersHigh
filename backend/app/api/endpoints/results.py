from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Result])
def read_results(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    모든 레이스 결과 목록 조회
    """
    results = crud.result.get_multi(db, skip=skip, limit=limit)
    return results

@router.post("/", response_model=schemas.Result)
def create_result(
    *,
    db: Session = Depends(deps.get_db),
    result_in: schemas.ResultCreate,
) -> Any:
    """
    새 레이스 결과 생성
    """
    # 러너와 레이스가 존재하는지 확인
    runner = crud.runner.get(db=db, id=result_in.runner_id)
    if not runner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Runner not found",
        )
    
    race = crud.race.get(db=db, id=result_in.race_id)
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Race not found",
        )
    
    result = crud.result.create(db=db, obj_in=result_in)
    return result

@router.get("/{result_id}", response_model=schemas.ResultDetail)
def read_result(
    *,
    db: Session = Depends(deps.get_db),
    result_id: int,
) -> Any:
    """
    특정 레이스 결과 상세 조회
    """
    result = crud.result.get(db=db, id=result_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found",
        )
    return result

@router.put("/{result_id}", response_model=schemas.Result)
def update_result(
    *,
    db: Session = Depends(deps.get_db),
    result_id: int,
    result_in: schemas.ResultUpdate,
) -> Any:
    """
    레이스 결과 업데이트
    """
    result = crud.result.get(db=db, id=result_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found",
        )
    result = crud.result.update(db=db, db_obj=result, obj_in=result_in)
    return result

@router.delete("/{result_id}", response_model=schemas.Result)
def delete_result(
    *,
    db: Session = Depends(deps.get_db),
    result_id: int,
) -> Any:
    """
    레이스 결과 삭제
    """
    result = crud.result.get(db=db, id=result_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found",
        )
    result = crud.result.remove(db=db, id=result_id)
    return result
