# Coding Platform Frontend (Next.js + TypeScript)

실무형 코딩 테스트 백엔드(`coding-platform-backend`)와 직접 통신하는 Next.js 14 + TypeScript 기반 프런트엔드입니다. 회원 인증, 문제 탐색/상세, 코드 제출, 제출 내역, 대시보드/리더보드 등 주요 기능을 한 화면에서 경험할 수 있도록 구성했습니다.

## 사전 준비

1. 루트에서 백엔드를 기동합니다.
   ```bash
   cd coding-platform-backend
   cp .env.example .env
   docker compose up -d --build
   ```
2. 프런트엔드 환경 변수를 설정합니다.
   ```bash
   cd coding-platform-frontend
   cp .env.example .env               # Docker/배포용 (NEXT_PUBLIC_* 값 정의)
   cp .env.local.example .env.local   # 로컬 개발용
   ```
   `.env`는 Docker/배포 시 백엔드 API(`SERVER_API_BASE_URL=http://legendheodongun.com:8080`)와 브라우저 접근용 주소(`NEXT_PUBLIC_API_BASE_URL=http://legendheodongun.com:8080`)를 모두 정의합니다. 로컬 백엔드를 직접 붙이고 싶다면 해당 값을 `http://localhost:8080` 등으로 교체하세요.
   `.env.local` 예시:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://legendheodongun.com:8080
   SERVER_API_BASE_URL=http://legendheodongun.com:8080
   ```

## 설치 및 실행

```bash
npm install        # 최초 1회
npm run dev        # http://localhost:3000
```

빌드 / 검증
```bash
npm run lint
npm run build
```

## 주요 화면

- **Landing**: 백엔드 `/api/problems`, `/api/dashboard/stats` 데이터를 조합한 하이라이트 영역.
- **Auth (로그인/회원가입)**: JWT 발급 후 로컬 스토리지에 세션을 저장하고 `useAuth` 컨텍스트로 공유.
- **Problems**: 필터/검색 UI와 함께 문제 카드 렌더링.
- **Problem Detail**: Monaco Editor 기반 자동완성 편집기에서 코드를 작성하고 `/api/submissions`로 제출.
- **Instant Run**: 동일 화면에서 `/api/execute`를 호출해 Docker 샌드박스 결과(stdout/stderr, exit code)를 즉시 확인.
- **Submissions**: `/api/submissions` 목록을 인증 토큰으로 호출해 테이블로 표시.
- **Dashboard**: `/api/dashboard/stats`, `/api/leaderboard`, `/health` 호출 결과를 카드/리스트로 시각화.

## 구조 개요

```
src/
├── app/                 # Next.js App Router 페이지
├── components/
│   ├── auth/            # 로그인/회원가입 폼
│   ├── layout/          # Navbar, Footer
│   ├── editor/          # Monaco 기반 코드 에디터
│   ├── problems/        # 문제 카드/상세/실행
│   └── submissions/     # 제출 테이블
├── lib/
│   ├── api.ts           # 공통 fetch 래퍼
│   ├── config.ts        # API 기본 설정
│   ├── types.ts         # 백엔드 DTO 타입
│   └── utils.ts         # UI 유틸리티
```

## 연결 확인 방법

1. 백엔드 `docker compose`로 기동 후 `curl http://localhost:8080/health`로 OK 확인.
2. 프런트엔드를 `npm run dev`로 실행.
3. 브라우저에서 다음을 확인:
   - `/dashboard`: Health 카드가 `OK`로 표기돼야 함.
   - `/problems`: 백엔드 문제 목록이 카드에 표시돼야 함.
   - `/register`: 이메일 인증 코드 발송 → 코드 입력 → 회원가입 완료.
   - `/login`: 인증 완료된 계정으로 로그인.
   - 문제 상세 페이지에서 코드 제출 → `/submissions`에서 상태 확인.
   - 즉시 실행 영역에 `python main.py` 등 명령 입력 후 결과(stdout/stderr/exit code)를 확인.

## 기타

- Tailwind CSS 4 + 커스텀 UI 컴포넌트로 스타일을 구성했습니다.
- 모든 API 호출은 `NEXT_PUBLIC_API_BASE_URL`을 기준으로 수행하므로 배포 시 환경변수만 교체하면 됩니다.

## Docker 배포/실행

### 단독 실행
```bash
# 환경변수 준비 (이미 했다면 생략)
cp .env.example .env
# 기본값은 http://legendheodongun.com:8080 이며, 로컬에서 백엔드를 띄우는 경우
# NEXT_PUBLIC_API_BASE_URL / SERVER_API_BASE_URL 값을 http://localhost:8080 등으로 바꿔주세요.

# 이미지 빌드
docker build -t coding-platform-frontend .

# 컨테이너 실행
docker run --env-file .env -p 3100:3000 coding-platform-frontend
```

### 전체 스택(docker compose)
```bash
cd ../coding-platform-backend
cp .env.example .env
mkdir -p executions
docker compose up -d --build
```
`frontend` 서비스가 함께 뜨며 기본 포트는 `http://localhost:3100` 입니다 (`FRONTEND_PORT`로 조정 가능).
