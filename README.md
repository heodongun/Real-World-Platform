# Coding Platform

This is a monorepo for a coding platform application, consisting of a backend API and a frontend web application.

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)

## About the Project

This project is a comprehensive platform for practicing coding skills. It allows users to solve programming problems, submit their solutions, and receive feedback. The platform is designed to be a tool for both learning and preparing for technical interviews.

### Features

*   **Solve a variety of coding problems:** A wide range of problems with varying difficulty levels.
*   **Submit and test your code:** An online editor to write, run, and test your solutions against predefined test cases.
*   **View your submission history:** Keep track of your past submissions and review your code.
*   **User authentication:** Secure user registration and login.

## Getting Started

### Prerequisites

*   [Docker](https://www.docker.com/get-started)
*   [Node.js](https://nodejs.org/en/) (v18 or later)
*   [JDK](https://www.oracle.com/java/technologies/downloads/) (v17 or later)

### Installation

1.  **Clone the repository:**
    ```sh
git clone <repository-url>
cd <repository-directory>
    ```

2.  **Set up the backend:**
    ```sh
    cd coding-platform-backend
    cp .env.example .env
    mkdir -p executions
    ```

3.  **Start all services (Backend, Database, Redis, etc.):**
    ```sh
    docker compose up -d --build
    ```

4.  **Set up the frontend:**
    ```sh
    cd ../coding-platform-frontend
    npm install
    ```

5.  **Run the frontend development server:**
    ```sh
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

## Usage

After following the installation steps, the frontend development server will be running at `http://localhost:3000`. You can access the application in your web browser at this address.

The backend API will be running and accessible to the frontend. You can also interact with the API directly. Refer to the backend source code for API endpoints and request/response formats.

## Tech Stack

### Backend

*   [Ktor](https://ktor.io/) - A framework for building asynchronous servers and clients in Kotlin.
*   [Kotlin](https://kotlinlang.org/) - A modern, concise, and safe programming language.
*   [PostgreSQL](https://www.postgresql.org/) - A powerful, open source object-relational database system.
*   [Redis](https://redis.io/) - An in-memory data structure store, used as a database, cache, and message broker.
*   [Docker](https://www.docker.com/) - A platform for developing, shipping, and running applications in containers.

### Frontend

*   [Next.js](https://nextjs.org/) - A React framework for building server-side rendered and static web applications.
*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
*   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feature/your-feature-name`
3.  **Make your changes and commit them:** `git commit -m 'feat(scope): add some feature'` (Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification).
4.  **Push to the branch:** `git push origin feature/your-feature-name`
5.  **Create a pull request.**

Before submitting a pull request, please ensure that:

*   The backend tests pass: `./gradlew test`
*   The backend code is formatted correctly: `./gradlew ktlintCheck`
*   The frontend linter passes: `npm run lint`
