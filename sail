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

# Pick build tool inside the container
detect_cmd='
if [ -f "./gradlew" ]; then echo "./gradlew";
elif [ -f "./mvnw" ]; then echo "./mvnw";
elif command -v gradle >/dev/null 2>&1; then echo "gradle";
elif command -v mvn >/dev/null 2>&1; then echo "mvn";
else echo "none"; fi
'

run_in_app() {
  $DC exec -it "$APP_SERVICE" bash -lc "$1"
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
    tool=$($DC exec -it "$APP_SERVICE" bash -lc "$detect_cmd")
    if [[ "$tool" == "none" ]]; then
      echo "No Gradle/Maven wrapper found in project."; exit 1
    fi
    if [[ "$tool" == "./gradlew" || "$tool" == "gradle" ]]; then
      run_in_app "$tool bootRun -x test"
    else
      # Maven
      run_in_app "$tool spring-boot:run -DskipTests"
    fi
    ;;
  debug)
    check_docker
    tool=$($DC exec -it "$APP_SERVICE" bash -lc "$detect_cmd")
    if [[ "$tool" == "none" ]]; then
      echo "No Gradle/Maven wrapper found in project."; exit 1
    fi
    if [[ "$tool" == "./gradlew" || "$tool" == "gradle" ]]; then
      run_in_app "$tool bootRun -x test --debug-jvm"
    else
      # Maven
      run_in_app "$tool spring-boot:run -DskipTests -Dspring-boot.run.jvmArguments='-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=*:5005'"
    fi
    ;;
  test)
    check_docker
    tool=$($DC exec -it "$APP_SERVICE" bash -lc "$detect_cmd")
    if [[ "$tool" == "none" ]]; then
      echo "No Gradle/Maven wrapper found in project."; exit 1
    fi
    if [[ "$tool" == "./gradlew" || "$tool" == "gradle" ]]; then
      run_in_app "$tool test"
    else
      run_in_app "$tool -DskipITs=false test"
    fi
    ;;
  clean)
    check_docker
    tool=$($DC exec -it "$APP_SERVICE" bash -lc "$detect_cmd")
    if [[ "$tool" == "none" ]]; then exit 0; fi
    if [[ "$tool" == "./gradlew" || "$tool" == "gradle" ]]; then
      run_in_app "$tool clean"
    else
      run_in_app "$tool clean"
    fi
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
  ./sail run            Run the app (hot reload via devtools)
  ./sail debug          Run the app with debug port 5005 enabled
  ./sail test           Run tests in the container
  ./sail clean          Clean build artifacts
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
