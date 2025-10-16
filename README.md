# Spring Boot + Next.js Full-Stack Template

## Team Members

- Claire
- Jenny
- Julia
- Laurie

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

- **Docker Desktop** (macOS/Windows) or **Docker Engine** (Linux)
- **Node.js 22.20.0** (see `.nvmrc` file for exact version)
- **Terminal access** for running commands
- **(Windows users)** Git Bash or WSL recommended for best experience

**Note**: No Java or Gradle installation needed - backend runs in Docker containers.

  <details>
  <summary><strong>🏫 School Network Users - Important Note</strong></summary>

  If you're on a school network with security restrictions, you may need to:
  - Use a specific NVM mirror for Node.js installation
  - Temporarily disable SSL verification for npm installs

  See the [Initial Setup](#initial-setup) section for detailed instructions.

  </details>

## Initial Setup

### 1. Install Required Software

**Docker Desktop**
- Download from: https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop (takes a moment to boot)

**Visual Studio Code**
- Download from: https://code.visualstudio.com/download
- Install and verify it works

**Git**
- **Windows users**: Download from https://gitforwindows.org/ (includes Git Bash)
- **Mac users**: Install Xcode Command Line Tools: `xcode-select --install`

  <details>
  <summary><strong>🍎 Mac Users - Xcode Command Line Tools</strong></summary>

  If you don't have Git installed on Mac, run this command in Terminal:

  ```bash
  xcode-select --install
  ```

  This will install Git and other essential development tools. You may be prompted to install additional software - click "Install" when prompted.

  </details>

### 2. Clone the Repository

1. Open the repository: https://github.com/HolyNamesAcademy/Projects-II-25-26/
2. Click the green "Code" button and copy the repository URL
3. Open VSCode and click "Clone Repository"
4. Paste the repository URL and clone
5. Open the project in VSCode

### 3. Fix Line Endings (Windows Users Only)

  <details>
  <summary><strong>🪟 Windows Users - Line Endings Fix</strong></summary>

  To ensure all files use Linux (LF) line endings (required for Docker and shell scripts), run this command in Git Bash:

  ```bash
  find . -type f -not -path '*/\.git/*' -exec dos2unix {} +; git checkout .
  ```

  This converts Windows (CRLF) line endings to Unix (LF) format, which is required for proper Docker container execution.

  </details>

### 4. Install Node Version Manager (NVM)

**Install NVM:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

**Configure NVM:**
- **Windows (Git Bash):** `nano ~/.bash_profile`
- **Mac:** `nano ~/.zshrc`

Add this content:
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

Save with: `Ctrl+X`, then `Y`, then `Enter`

**Open a new terminal** (Git Bash on Windows)

### 5. Install Node.js

  <details>
  <summary><strong>🏫 School Network (with security restrictions)</strong></summary>

  ```bash
  NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist nvm install
  ```

  </details>

  <details>
  <summary><strong>🏠 Home Network</strong></summary>

  ```bash
  nvm install
  ```

  </details>

### 6. Install Project Dependencies

  <details>
  <summary><strong>🏫 School Network (with security restrictions)</strong></summary>

  ```bash
  cd frontend
  # Disable SSL verification temporarily for school network
  npm config set strict-ssl false
  npm install
  # Re-enable SSL verification for security
  npm config set strict-ssl true
  ```

  </details>

  <details>
  <summary><strong>🏠 Home Network</strong></summary>

  ```bash
  cd frontend
  npm install
  ```

  </details>

## Quick Start

> **First time?** Make sure you've completed the [Initial Setup](#initial-setup) steps above.

1. **Start the development environment:**
   ```bash
   ./sail up
   ```

2. **Run the backend:**
   ```bash
   ./sail backend
   ```

3. **Run the frontend (in a new terminal):**
   ```bash
   ./sail frontend
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
./sail backend:lint Run backend checkstyle and SpotBugs linting
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
│   ├── build.gradle           # Gradle build configuration
│   └── config/checkstyle/     # Code quality configuration
├── frontend/                  # Next.js frontend
│   ├── src/app/              # App router pages
│   │   ├── api-demo/         # API integration demo page
│   │   └── page.tsx          # Home page
│   ├── src/lib/              # API utilities
│   │   └── api.ts            # Centralized API client
│   ├── package.json          # Frontend dependencies
│   ├── next.config.ts        # Next.js configuration
│   └── tsconfig.json         # TypeScript configuration
├── .github/workflows/         # GitHub Actions CI/CD workflows
│   ├── ci.yml                # Main CI pipeline
│   ├── backend-*.yml         # Backend-specific workflows
│   └── frontend-*.yml        # Frontend-specific workflows
├── docker-compose.yml         # Docker services configuration
├── Dockerfile.dev             # App container image
├── .nvmrc                     # Node.js version specification
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

### Development Workflow

1. **Start services**: `./sail up` (starts Docker containers)
2. **Run backend**: `./sail backend` (in one terminal)
3. **Run frontend**: `./sail frontend` (in another terminal)
4. **Make changes**: Edit code in your IDE
5. **See changes**: Frontend updates automatically, backend restarts automatically
6. **Test API**: Visit `http://localhost:3000/api-demo` to test integration

## CI/CD Pipeline

The `.github/workflows/` folder contains GitHub Actions workflows that automatically run on every push and pull request, handling linting, building, and testing for both frontend and backend.

## Deployment

This template is ready for deployment to any cloud provider that supports Spring Boot and Next.js applications. Update the environment variables in your deployment platform to point to your production services.

## Troubleshooting

### Common Issues

  <details>
  <summary><strong>🌐 CORS Errors</strong></summary>

  - Ensure backend is running on port 8080
  - Check CORS configuration in `backend/src/main/java/com/hna/webserver/config/CorsConfig.java`
  - Verify frontend is running on localhost:3000

  </details>

  <details>
  <summary><strong>🔌 API Connection Failed</strong></summary>

  - Verify backend is running: `./sail ps`
  - Check backend logs: `./sail logs`
  - Ensure services are up: `./sail up`

  </details>

  <details>
  <summary><strong>⚛️ Frontend Not Loading</strong></summary>

  - Ensure Node.js version matches `.nvmrc` (22.20.0)
  - Install dependencies: `cd frontend && npm install`
  - Check if port 3000 is available

  </details>

  <details>
  <summary><strong>🗄️ Database Connection Issues</strong></summary>

  - Ensure PostgreSQL is running: `./sail ps`
  - Check database logs: `./sail logs db`
  - Verify connection settings in `application-dev.yml`

  </details>

  <details>
  <summary><strong>🐳 Docker Issues</strong></summary>

  - Check Docker daemon is running: `./sail status`
  - Restart Docker Desktop if needed
  - Clean up containers: `./sail down && docker system prune`
  - Rebuild containers: `./sail build`

  </details>

  <details>
  <summary><strong>🔌 Port Conflicts</strong></summary>

  - Ensure ports 3000, 8080, 5432, 6379, and 8025 are available
  - Check what's using a port: `lsof -i :PORT_NUMBER` (macOS/Linux)
  - Kill process using port: `kill -9 PID` (replace PID with actual process ID)

  </details>

  <details>
  <summary><strong>🪟 Windows Terminal Issues</strong></summary>

  - Always use Git Bash instead of PowerShell for running `./sail` commands
  - In VSCode, click the arrow next to the `+` button in terminal and select "Git Bash"
  - If commands don't work, ensure you're in the project root directory

  </details>

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
