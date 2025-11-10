# Repository Guidelines

## Project Structure & Module Organization
The repo comprises `coding-platform-backend` (Ktor/Kotlin API) and `coding-platform-frontend` (Next.js + TypeScript). Backend logic stays under `src/main/kotlin/com/codingplatform`, with `plugins/` for setup, `routes/` for HTTP entry points, `services/` + `executor/` for business and sandbox flows, and `models/` mirroring SQL kept in `database/`. Compose, Dockerfile, monitoring, and docs live in the backend root. The frontend organizes pages in `src/app`, UI in `src/components`, API helpers in `src/lib`, and static assets in `public/`.

## Build, Test, and Development Commands
- `cd coding-platform-backend && cp .env.example .env && mkdir -p executions` – seed env files and shared workspace.
- `docker compose up -d --build` – start the API, Postgres, Redis, Grafana, and executor workers.
- `./gradlew build | run | test` – compile, launch, or validate the Kotlin stack; Postgres/Redis must match `.env`.
- `cd coding-platform-frontend && npm install` once, then `npm run dev`, `npm run build`, and `npm run lint`.

## Coding Style & Naming Conventions
Follow Kotlin’s 4-space style, keep public declarations typed, and scope each `Routes`, `Service`, or `Repository` file to one responsibility. DTOs mirror response schemas: snake_case externally, lowerCamelCase internally. The frontend obeys `eslint.config.mjs` with 2-space indentation, PascalCase React components, and co-located styles. Run `./gradlew ktlintCheck` and `npm run lint` before a PR; rely on `ktlintFormat` or IDE formatters for fixes.

## Testing Guidelines
Place backend tests under `src/test/kotlin`, mirroring packages such as `ProblemRoutesTest.kt`. Use JUnit 5 + MockK for unit seams and Ktor `testApplication {}` for HTTP contracts. Cover success and failure paths, especially sandbox resource handling, and run suites with Postgres/Redis reachable (compose defaults or explicit `DATABASE_URL`/`REDIS_URL`). The frontend lacks scripted tests; when touching UI flows, add Playwright or React Testing Library specs under `src/__tests__` and expose an npm script so CI can run them.

## Commit & Pull Request Guidelines
Use Conventional Commits (`feat(executor): cache docker layers`) with ≤72 character subjects and concise bodies. PRs should link the tracking issue, summarize API/UI impact, list new env vars or migrations, and attach screenshots or curl transcripts for user-visible work. Before review, run `./gradlew test`, `./gradlew ktlintCheck`, `npm run lint`, and the relevant build; automation failures block merge.

## Security & Configuration Tips
Never commit populated `.env*` files or anything under `executions/`. Executor Dockerfiles must retain `no-new-privileges`, CPU/memory caps, and isolated volumes. When editing monitoring, keep `monitoring/prometheus.yml` and the bundled Grafana dashboards in sync so alerts continue to reflect deployed endpoints.
