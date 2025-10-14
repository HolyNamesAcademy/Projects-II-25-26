# Spring Boot + Next.js Full-Stack Template

## Team Members

- Jenny

A modern full-stack web application template featuring Spring Boot backend and Next.js frontend with Docker-based development environment.

**Zero-install development setup** - Get started instantly with Docker containers for all services and dependencies. No need to install Java, Gradle, or databases locally.

## Features

- **Full-Stack Integration** - Spring Boot 3.5.6 backend with Next.js 15.5.4 frontend
- **Containerized Development** - Backend runs in Docker, frontend runs locally for optimal development experience
- **Instant Setup** - No local Java/Gradle installation required for backend
- **Live Reload** - Automatic code changes with Spring Boot DevTools and Next.js hot reload
- **Complete Stack** - PostgreSQL database, Redis cache, and Mailpit email testing
- **API Integration** - Seamless communication between frontend and backend with CORS configuration
- **Type Safety** - TypeScript interfaces for API responses and centralized API client
- **CI/CD Ready** - GitHub Actions workflows for linting, building, and testing
- **Simple Commands** - Easy-to-use `sail` CLI for all development tasks

## Prerequisites

- Docker Desktop (macOS/Windows) or Docker Engine (Linux)
- Node.js 22.20.0 (see `.nvmrc` file)
- Terminal access for running commands
- (Windows users) Git Bash or WSL recommended for best experience

**Note**: No Java or Gradle installation needed - backend runs in Docker containers.

## Quick Start

1. **Start the development environment:**
   ```bash
   ./sail up
   ```

2. **Run both frontend and backend:**
   ```bash
   ./sail both
   ```

**Development URLs:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **API Demo**: http://localhost:3000/api-demo
- **Mailpit UI**: http://localhost:8025 (SMTP on `1025`)
- **Postgres**: `localhost:5432` (db/user/pass: `app` / `app` / `app`)
- **Redis**: `localhost:6379`

## Development Commands

### Full-Stack Development
```text
./sail up        Start dev environment (services only)
./sail both      Run both frontend and backend together
./sail dev       Run both frontend and backend together (alias)
./sail down      Stop everything
./sail restart   Restart all containers
```

### Backend Commands
```text
./sail run       Run the backend (hot reload via devtools)
./sail backend   Run the backend (alias for run)
./sail debug     Run the backend with debug port 5005 enabled
./sail test      Run backend tests in the container
./sail clean     Clean build artifacts in the container
./sail backend:lint Run backend checkstyle linting
```

### Frontend Commands
```text
./sail frontend       Run the frontend dev server
./sail frontend:dev   Run the frontend dev server (alias)
./sail frontend:build Build the frontend for production
./sail frontend:start Start the frontend production server
./sail frontend:lint  Run frontend linting
```

### Docker Commands
```text
./sail build     Rebuild the app image
./sail sh        Shell into the app container (bash)
./sail logs      Tail all container logs
./sail ps        Show container status
./sail status    Check Docker daemon and container status
./sail psql      Open psql in the Postgres container
./sail redis-cli Open redis-cli in the Redis container
```

## Project Structure

```
├── backend/                    # Spring Boot backend
│   ├── src/main/java/         # Java source code
│   │   └── com/hna/webserver/
│   │       ├── config/        # CORS configuration
│   │       └── controller/    # REST controllers
│   ├── src/main/resources/    # Application configuration
│   │   ├── application.properties
│   │   └── application-dev.yml # Docker dev profile
│   └── build.gradle           # Gradle build configuration
├── frontend/                  # Next.js frontend
│   ├── src/app/              # App router pages
│   │   ├── api-demo/         # API integration demo page
│   │   └── page.tsx          # Home page
│   ├── src/lib/              # API utilities
│   │   └── api.ts            # Centralized API client
│   ├── package.json          # Frontend dependencies
│   └── next.config.ts        # Next.js configuration
├── .github/workflows/         # GitHub Actions CI/CD workflows
├── docker-compose.yml         # Docker services configuration
├── Dockerfile.dev             # App container image
├── sail                       # Command helper script
└── README.md                  # This file
```

## API Integration

### Example Endpoints
The backend includes sample REST endpoints to get you started:
- `GET /api/hello` - Hello world
- `GET /api/health` - Health check
- `GET /api/users` - Sample data

### API Demo Page
Visit `http://localhost:3000/api-demo` to see the API integration in action.

### Using the API
```typescript
import { api } from '@/lib/api';

// Example usage
const data = await api.hello();
```

## Development Notes

- **Hot reload**: Spring Boot DevTools for backend, Next.js hot reload for frontend
- **CORS**: Configured to allow frontend requests from localhost:3000
- **API Proxying**: Next.js automatically proxies `/api/*` to backend
- **Type Safety**: TypeScript interfaces for all API responses
- **Profiles**: Backend runs with `SPRING_PROFILES_ACTIVE=dev` in Docker
- **Database**: PostgreSQL configured for development
- **Caching**: Redis available for caching
- **Email**: Mailpit for email testing

## CI/CD Pipeline

The `.github/workflows/` folder contains GitHub Actions workflows that automatically run on every push and pull request, handling linting, building, and testing for both frontend and backend.

## Deployment

This template is ready for deployment to any cloud provider that supports Spring Boot and Next.js applications. Update the environment variables in your deployment platform to point to your production services.

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 8080
   - Check CORS configuration in `backend/src/main/java/com/hna/webserver/config/CorsConfig.java`
   - Verify frontend is running on localhost:3000

2. **API Connection Failed**
   - Verify backend is running: `./sail ps`
   - Check backend logs: `./sail logs`
   - Ensure services are up: `./sail up`

3. **Frontend Not Loading**
   - Ensure Node.js version matches `.nvmrc` (22.20.0)
   - Install dependencies: `cd frontend && npm install`
   - Check if port 3000 is available

4. **Database Connection Issues**
   - Ensure PostgreSQL is running: `./sail ps`
   - Check database logs: `./sail logs db`
   - Verify connection settings in `application-dev.yml`

5. **Docker Issues**
   - Check Docker daemon is running: `./sail status`
   - Restart Docker Desktop if needed
   - Clean up containers: `./sail down && docker system prune`

### Debug Commands
```bash
# Check service status
./sail ps

# View all logs
./sail logs

# Check Docker status
./sail status

# Shell into backend container
./sail sh

# Test API endpoints directly
curl http://localhost:8080/api/health
curl http://localhost:8080/api/hello
```
