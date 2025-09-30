# GitHub Actions CI/CD

This repository uses GitHub Actions for continuous integration and deployment. The workflows are organized to run in parallel for maximum efficiency.

## Workflows

### Individual Component Workflows

#### Frontend Lint (`frontend-lint.yml`)
- **Triggers**: Push/PR to main/develop branches affecting frontend code
- **Purpose**: Runs ESLint and TypeScript type checking
- **Status**: Shows linting issues and code quality

#### Frontend Build (`frontend-build.yml`)
- **Triggers**: Push/PR to main/develop branches affecting frontend code
- **Purpose**: Builds Next.js application for production
- **Artifacts**: Uploads build output for deployment

#### Backend Lint (`backend-lint.yml`)
- **Triggers**: Push/PR to main/develop branches affecting backend code
- **Purpose**: Runs Checkstyle and SpotBugs for code quality
- **Status**: Shows Java code style and bug detection issues

#### Backend Build (`backend-build.yml`)
- **Triggers**: Push/PR to main/develop branches affecting backend code
- **Purpose**: Builds Spring Boot application and runs tests
- **Services**: PostgreSQL and Redis for integration testing
- **Artifacts**: Uploads JAR file for deployment

### Combined Workflow

#### CI (`ci.yml`)
- **Triggers**: All pushes/PRs to main/develop branches
- **Purpose**: Orchestrates all individual workflows
- **Integration Test**: Tests full-stack integration
- **Status**: Overall project health indicator

## Workflow Features

### Parallel Execution
- All workflows run in parallel for faster feedback
- Each component has its own status indicator
- Independent failure/success states

### Smart Triggering
- Only runs when relevant files change
- Frontend workflows only trigger on frontend changes
- Backend workflows only trigger on backend changes

### Comprehensive Testing
- **Frontend**: ESLint, TypeScript, Build verification
- **Backend**: Checkstyle, SpotBugs, Unit tests, Integration tests
- **Full Stack**: API endpoint testing, Frontend-backend integration

### Artifact Management
- Build artifacts are uploaded and stored for 7 days
- Enables easy deployment and rollback capabilities

## Status Badges

Add these to your README to show build status:

```markdown
![Frontend Lint](https://github.com/your-org/your-repo/workflows/Frontend%20Lint/badge.svg)
![Frontend Build](https://github.com/your-org/your-repo/workflows/Frontend%20Build/badge.svg)
![Backend Lint](https://github.com/your-org/your-repo/workflows/Backend%20Lint/badge.svg)
![Backend Build](https://github.com/your-org/your-repo/workflows/Backend%20Build/badge.svg)
![CI](https://github.com/your-org/your-repo/workflows/CI/badge.svg)
```

## Local Development

To run the same checks locally:

```bash
# Frontend
cd frontend
npm run lint
npm run build

# Backend
./gradlew checkstyleMain checkstyleTest
./gradlew spotbugsMain spotbugsTest
./gradlew test
./gradlew build
```

## Configuration

### Frontend Linting
- ESLint configuration in `frontend/.eslintrc.json`
- TypeScript configuration in `frontend/tsconfig.json`

### Backend Linting
- Checkstyle configuration in `backend/config/checkstyle/checkstyle.xml`
- SpotBugs configuration in `backend/build.gradle`

### Environment Variables
- All workflows use default configurations
- No secrets required for basic CI functionality
- Database and Redis services are provided by GitHub Actions
