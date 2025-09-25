#!/usr/bin/env bash
set -euo pipefail

DC="docker compose"
APP_SERVICE="app"

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
    $DC up -d
    ;;
  down)
    $DC down
    ;;
  restart)
    $DC down && $DC up -d
    ;;
  build)
    $DC build --no-cache "$APP_SERVICE"
    ;;
  logs)
    $DC logs -f --tail=200
    ;;
  ps)
    $DC ps
    ;;
  sh|bash|shell)
    run_in_app "bash"
    ;;
  run)
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
    tool=$($DC exec -it "$APP_SERVICE" bash -lc "$detect_cmd")
    if [[ "$tool" == "none" ]]; then exit 0; fi
    if [[ "$tool" == "./gradlew" || "$tool" == "gradle" ]]; then
      run_in_app "$tool clean"
    else
      run_in_app "$tool clean"
    fi
    ;;
  psql)
    $DC exec -it db psql -U app -d app
    ;;
  redis-cli)
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
  ./sail psql           psql into Postgres
  ./sail redis-cli      redis-cli into Redis
EOF
    ;;
esac
