# 코딩 플랫폼

이것은 백엔드 API와 프론트엔드 웹 애플리케이션으로 구성된 코딩 플랫폼 애플리케이션을 위한 모노레포입니다.

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [시작하기](#시작하기)
  - [전제 조건](#전제-조건)
  - [설치](#설치)
- [사용법](#사용법)
- [기술 스택](#기술-스택)
- [기여](#기여)

## 프로젝트 소개

이 프로젝트는 코딩 실력을 연습할 수 있는 종합 플랫폼입니다. 사용자는 프로그래밍 문제를 풀고, 해결책을 제출하며, 피드백을 받을 수 있습니다. 이 플랫폼은 학습과 기술 면접 준비를 위한 도구로 설계되었습니다.

### 기능

*   **다양한 코딩 문제 해결:** 다양한 난이도의 광범위한 문제.
*   **코드 제출 및 테스트:** 미리 정의된 테스트 케이스에 대해 해결책을 작성, 실행 및 테스트할 수 있는 온라인 편집기.
*   **제출 기록 보기:** 과거 제출 기록을 추적하고 코드를 검토.
*   **사용자 인증:** 안전한 사용자 등록 및 로그인.

## 시작하기

### 전제 조건

*   [Docker](https://www.docker.com/get-started)
*   [Node.js](https://nodejs.org/en/) (v18 이상)
*   [JDK](https://www.oracle.com/java/technologies/downloads/) (v17 이상)

### 설치

1.  **리포지토리 복제:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **백엔드 설정:**
    ```sh
    cd coding-platform-backend
    cp .env.example .env
    mkdir -p executions
    ```

3.  **모든 서비스 시작 (백엔드, 데이터베이스, Redis 등):**
    ```sh
    docker compose up -d --build
    ```

4.  **프론트엔드 설정:**
    ```sh
    cd ../coding-platform-frontend
    npm install
    ```

5.  **프론트엔드 개발 서버 실행:**
    ```sh
    npm run dev
    ```
    프론트엔드는 `http://localhost:3000`에서 사용할 수 있습니다.

## 사용법

설치 단계를 따른 후, 프론트엔드 개발 서버가 `http://localhost:3000`에서 실행됩니다. 이 주소로 웹 브라우저에서 애플리케이션에 접속할 수 있습니다.

백엔드 API가 실행되고 프론트엔드에서 접근할 수 있습니다. API와 직접 상호 작용할 수도 있습니다. API 엔드포인트 및 요청/응답 형식은 백엔드 소스 코드를 참조하십시오.

## 기술 스택

### 백엔드

*   [Ktor](https://ktor.io/) - Kotlin으로 비동기 서버 및 클라이언트를 구축하기 위한 프레임워크.
*   [Kotlin](https://kotlinlang.org/) - 현대적이고 간결하며 안전한 프로그래밍 언어.
*   [PostgreSQL](https://www.postgresql.org/) - 강력한 오픈 소스 객체-관계형 데이터베이스 시스템.
*   [Redis](https://redis.io/) - 인메모리 데이터 구조 저장소로, 데이터베이스, 캐시 및 메시지 브로커로 사용됩니다.
*   [Docker](https://www.docker.com/) - 컨테이너에서 애플리케이션을 개발, 배송 및 실행하기 위한 플랫폼.

### 프론트엔드

*   [Next.js](https://nextjs.org/) - 서버 사이드 렌더링 및 정적 웹 애플리케이션을 구축하기 위한 React 프레임워크.
*   [React](https://reactjs.org/) - 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리.
*   [TypeScript](https://www.typescriptlang.org/) - 일반 JavaScript로 컴파일되는 JavaScript의 타입이 지정된 슈퍼셋.

## 기여

기여를 환영합니다! 다음 단계를 따라 기여해 주십시오:

1.  **리포지토리 포크.**
2.  **새 브랜치 생성:** `git checkout -b feature/your-feature-name`
3.  **변경 사항을 커밋:** `git commit -m 'feat(scope): add some feature'` ([Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 사양을 따르십시오).
4.  **브랜치에 푸시:** `git push origin feature/your-feature-name`
5.  **풀 리퀘스트 생성.**

풀 리퀘스트를 제출하기 전에 다음을 확인하십시오:

*   백엔드 테스트 통과: `./gradlew test`
*   백엔드 코드 형식 올바름: `./gradlew ktlintCheck`
*   프론트엔드 린터 통과: `npm run lint`
