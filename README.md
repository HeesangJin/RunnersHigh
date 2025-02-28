# RunnersHigh

마라톤 러너를 위한 랭킹 및 전적 시스템입니다.

## 프로젝트 구조

- **frontend**: React 기반 프론트엔드 애플리케이션
- **backend**: FastAPI 기반 백엔드 API 서버

## AWS 배포 가이드

이 프로젝트는 GitHub Actions를 사용하여 AWS에 자동 배포됩니다.

### 필요한 AWS 리소스

#### 프론트엔드
- S3 버킷 (정적 웹 호스팅용)
- CloudFront 배포 (CDN 및 HTTPS 지원)
- Route 53 (도메인 관리, 선택 사항)

#### 백엔드
- Elastic Beanstalk 환경 (Python 플랫폼)
- RDS 인스턴스 (PostgreSQL)
- VPC 및 보안 그룹

### 배포 준비 단계

1. **AWS 계정 설정**:
   - IAM 사용자 생성 (프로그래밍 방식 액세스)
   - 필요한 권한 부여: S3, CloudFront, Elastic Beanstalk, RDS 등

2. **S3 버킷 생성**:
   ```bash
   aws s3 mb s3://runners-high-frontend --region us-east-1
   ```

3. **S3 버킷 정적 웹 호스팅 활성화**:
   ```bash
   aws s3 website s3://runners-high-frontend --index-document index.html --error-document index.html
   ```

4. **CloudFront 배포 생성**:
   - 오리진: S3 버킷
   - 뷰어 프로토콜 정책: Redirect HTTP to HTTPS
   - 캐시 정책: CachingOptimized
   - 오리진 액세스 제어 설정

5. **Elastic Beanstalk 애플리케이션 및 환경 생성**:
   ```bash
   aws elasticbeanstalk create-application --application-name runners-high
   aws elasticbeanstalk create-environment --application-name runners-high --environment-name runners-high-prod --solution-stack-name "64bit Amazon Linux 2 v3.5.0 running Python 3.8" --option-settings file://eb-options.json
   ```

6. **RDS 데이터베이스 생성**:
   ```bash
   aws rds create-db-instance --db-instance-identifier runners-high-db --db-instance-class db.t3.micro --engine postgres --allocated-storage 20 --master-username admin --master-user-password YOUR_PASSWORD --vpc-security-group-ids sg-xxxxxxxx
   ```

### GitHub Secrets 설정

GitHub 리포지토리에 다음 시크릿을 추가해야 합니다:

- `AWS_ACCESS_KEY_ID`: AWS IAM 액세스 키
- `AWS_SECRET_ACCESS_KEY`: AWS IAM 시크릿 키
- `AWS_REGION`: AWS 리전 (예: us-east-1)
- `S3_BUCKET_NAME`: 프론트엔드 S3 버킷 이름
- `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront 배포 ID
- `EB_APPLICATION_NAME`: Elastic Beanstalk 애플리케이션 이름
- `EB_ENVIRONMENT_NAME`: Elastic Beanstalk 환경 이름
- `DATABASE_URL`: RDS 데이터베이스 연결 문자열
- `CORS_ORIGINS`: 허용된 CORS 오리진 (CloudFront 도메인)
- `REACT_APP_API_URL`: 백엔드 API URL (Elastic Beanstalk 도메인)

### 배포 프로세스

1. 코드를 `main` 브랜치에 푸시하면 GitHub Actions 워크플로우가 자동으로 실행됩니다.
2. 프론트엔드는 빌드 후 S3에 배포되고 CloudFront 캐시가 무효화됩니다.
3. 백엔드는 Elastic Beanstalk에 배포됩니다.
4. 배포 상태는 GitHub Actions 탭에서 확인할 수 있습니다.

## 로컬 개발 환경 설정

### 프론트엔드

```bash
cd frontend
npm install
npm start
```

### 백엔드

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 라이센스

MIT
