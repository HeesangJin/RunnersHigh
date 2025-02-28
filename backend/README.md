# RunnersHigh Backend

마라토너를 위한 랭킹 및 전적 시스템의 백엔드 API 서버입니다.

## 기술 스택

- FastAPI: 현대적이고 빠른 웹 프레임워크
- SQLAlchemy: SQL 툴킷 및 ORM
- Pydantic: 데이터 검증 및 설정 관리
- Alembic: 데이터베이스 마이그레이션
- PostgreSQL: 관계형 데이터베이스

## 설치 및 실행

### 1. 가상환경 설정

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 데이터베이스 설정

PostgreSQL 데이터베이스를 생성하고 `.env` 파일에 연결 정보를 설정합니다:

```
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=runners_high
SECRET_KEY=your-secret-key
```

### 4. 데이터베이스 마이그레이션

```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 5. 서버 실행

```bash
python main.py
```

서버는 기본적으로 http://localhost:8000 에서 실행됩니다.
API 문서는 http://localhost:8000/docs 에서 확인할 수 있습니다.

## API 엔드포인트

### 러너(마라토너)

- `GET /api/v1/runners/`: 모든 러너 목록 조회
- `POST /api/v1/runners/`: 새 러너 생성
- `GET /api/v1/runners/{runner_id}`: 특정 러너 상세 정보 조회
- `PUT /api/v1/runners/{runner_id}`: 러너 정보 업데이트
- `DELETE /api/v1/runners/{runner_id}`: 러너 삭제

### 대회(레이스)

- `GET /api/v1/races/`: 모든 대회 목록 조회
- `POST /api/v1/races/`: 새 대회 생성
- `GET /api/v1/races/{race_id}`: 특정 대회 상세 정보 조회
- `PUT /api/v1/races/{race_id}`: 대회 정보 업데이트
- `DELETE /api/v1/races/{race_id}`: 대회 삭제

### 결과(레이스 결과)

- `GET /api/v1/results/`: 모든 결과 목록 조회
- `POST /api/v1/results/`: 새 결과 생성
- `GET /api/v1/results/{result_id}`: 특정 결과 상세 정보 조회
- `PUT /api/v1/results/{result_id}`: 결과 정보 업데이트
- `DELETE /api/v1/results/{result_id}`: 결과 삭제
