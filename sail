#!/usr/bin/env bash
set -euo pipefail

DC="docker compose"
APP_SERVICE="app"

SAIL_VERSION="v0.0.7"

# Check if Docker daemon is running
check_docker() {
  if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker daemon is not running!"
    echo "Please start Docker Desktop or Docker daemon and try again."
    exit 1
  fi
}

# Check Docker status with detailed information
docker_status() {
  echo "🐳 Docker Status Check"
  echo "======================"

  if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker daemon is not running"
    echo "   Please start Docker Desktop or Docker daemon"
    return 1
  fi

  echo "✅ Docker daemon is running"

  # Get Docker version
  echo "📋 Docker Version:"
  docker --version

  # Get Docker Compose version
  echo "📋 Docker Compose Version:"
  docker compose version

  # Check if containers are running
  echo ""
  echo "📦 Container Status:"
  if $DC ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | grep -q "spring-sail"; then
    $DC ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
  else
    echo "   No Spring Sail containers are currently running"
    echo "   Run './sail up' to start the development environment"
  fi

  # Check Docker system info
  echo ""
  echo "💾 Docker System Info:"
  docker system df --format "table {{.Type}}\t{{.TotalCount}}\t{{.Size}}"

  return 0
}

run_in_app() {
  $DC exec -it "$APP_SERVICE" bash -lc "$1"
}

run_in_backend() {
  $DC exec -it "$APP_SERVICE" bash -lc "cd backend && $1"
}

run_frontend() {
  cd frontend && npm run "$1"
}

run_backend() {
  check_docker
  run_in_backend "./gradlew bootRun -x test"
}

cmd="${1:-help}"
shift || true

case "$cmd" in
  up)
    check_docker
    $DC up -d
    ;;
  down)
    check_docker
    $DC down
    ;;
  restart)
    check_docker
    $DC down && $DC up -d
    ;;
  build)
    check_docker
    $DC build --no-cache "$APP_SERVICE"
    ;;
  logs)
    check_docker
    $DC logs -f --tail=200
    ;;
  ps)
    check_docker
    $DC ps
    ;;
  docker-status|status)
    docker_status
    ;;
  version|--version|-v)
    echo "Spring Sail version: $SAIL_VERSION"
    ;;
  sh|bash|shell)
    check_docker
    run_in_app "bash"
    ;;
  run)
    check_docker
    run_in_backend "./gradlew bootRun -x test"
    ;;
  frontend|frontend:dev)
    run_frontend "dev"
    ;;
  frontend:build)
    run_frontend "build"
    ;;
  frontend:start)
    run_frontend "start"
    ;;
  frontend:lint)
    run_frontend "lint"
    ;;
  backend|backend:dev)
    run_backend
    ;;
  backend:lint)
    check_docker
    echo "Running checkstyle checks..."
    run_in_backend "./gradlew checkstyleMain checkstyleTest"
    echo "Running SpotBugs checks..."
    run_in_backend "./gradlew spotbugsMain spotbugsTest"
    ;;
  both|dev)
    echo "Starting both frontend and backend..."
    echo "Frontend will run on http://localhost:3000"
    echo "Backend will run on http://localhost:8080"
    echo ""
    echo "Starting backend in background..."
    run_backend &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    echo ""
    echo "Starting frontend..."
    run_frontend "dev"
    ;;
  debug)
    check_docker
    run_in_backend "./gradlew bootRun -x test --debug-jvm"
    ;;
  test)
    check_docker
    run_in_backend "./gradlew test"
    ;;
  clean)
    check_docker
    run_in_backend "./gradlew clean"
    ;;
  psql)
    check_docker
    $DC exec -it db psql -U app -d app
    ;;
  redis-cli)
    check_docker
    $DC exec -it redis redis-cli
    ;;
  *)
    cat <<'EOF'
Spring Sail commands:
  ./sail up             Start dev environment (app + services)
  ./sail down           Stop everything
  ./sail restart        Restart containers
  ./sail build          Rebuild the app image

  # Backend commands
  ./sail run            Run the backend (hot reload via devtools)
  ./sail backend        Run the backend (alias for run)
  ./sail debug          Run the backend with debug port 5005 enabled
  ./sail test           Run backend tests in the container
  ./sail clean          Clean build artifacts
  ./sail backend:lint   Run backend checkstyle linting

  # Frontend commands
  ./sail frontend       Run the frontend dev server
  ./sail frontend:dev   Run the frontend dev server (alias)
  ./sail frontend:build Build the frontend for production
  ./sail frontend:start Start the frontend production server
  ./sail frontend:lint  Run frontend linting

  # Combined commands
  ./sail both           Run both frontend and backend together
  ./sail dev            Run both frontend and backend together (alias)

  # Docker commands
  ./sail sh             Shell into the app container
  ./sail logs           Tail logs
  ./sail ps             Show container status
  ./sail status         Check Docker daemon and container status
  ./sail version        Show Spring Sail version
  ./sail psql           psql into Postgres
  ./sail redis-cli      redis-cli into Redis
EOF
    ;;
esac
