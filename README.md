# Spring React Template

A modern full-stack web application template featuring Spring Boot backend and React frontend with Docker-based development environment.

**Zero-install development setup** - Get started instantly with Docker containers for all services and dependencies. No need to install Java, Gradle, or databases locally.

## Features

- **Containerized Development** - Everything runs in Docker containers
- **Instant Setup** - No local Java/Gradle installation required
- **Live Reload** - Automatic code changes with Spring Boot DevTools
- **Complete Stack** - Postgres database, Redis cache, and email testing
- **Simple Commands** - Easy-to-use CLI for all development tasks
- **Gradle Integration** - Works seamlessly with Gradle build system

## Prerequisites

- Docker Desktop (macOS/Windows) or Docker Engine (Linux)
- Terminal access for running commands
- (Windows users) Git Bash or WSL recommended for best experience

That's it! No Java, Gradle, or database installations needed.

## Quick Start

1. **Start the development environment:**
   ```bash
   ./sail up
   ```

2. **Run the application:**
   ```bash
   ./sail run
   ```

**Services:**
- App: http://localhost:8080
- Mailpit UI: http://localhost:8025 (SMTP on `1025`)
- Postgres: `localhost:5432` (db/user/pass: `app` / `app` / `app`)
- Redis: `localhost:6379`

## Development Commands

```text
./sail up        Start dev environment (app + services)
./sail down      Stop everything
./sail restart   Restart all containers
./sail build     Rebuild the app image
./sail run       Run the app (hot reload via devtools)
./sail test      Run tests in the container
./sail clean     Clean build artifacts in the container
./sail sh        Shell into the app container (bash)
./sail logs      Tail all container logs
./sail ps        Show container status
./sail psql      Open psql in the Postgres container
./sail redis-cli Open redis-cli in the Redis container
```

## Project Structure

```
├── backend/                    # Spring Boot backend
│   ├── src/main/java/         # Java source code
│   ├── src/main/resources/    # Application configuration
│   │   ├── application.properties
│   │   └── application-dev.yml # Docker dev profile
│   └── build.gradle           # Gradle build configuration
├── docker-compose.yml         # Docker services configuration
├── Dockerfile.dev             # App container image
├── sail                       # Command helper script
└── README.md                  # This file
```

## Development Notes

- **Hot reload**: Spring Boot DevTools included for automatic restarts
- **Profiles**: App runs with `SPRING_PROFILES_ACTIVE=dev` in Docker
- **Database**: Postgres configured for development
- **Caching**: Redis available for caching
- **Email**: Mailpit for email testing

## Frontend (React)

*Coming soon - React frontend will be added to this template*

## Deployment

This template is ready for deployment to platforms like Heroku, AWS, or any cloud provider that supports Spring Boot applications.
