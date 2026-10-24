#!/usr/bin/env bash
set -euo pipefail

name="$1"
image="$2"
shift 2

previous_image="$(docker inspect --format '{{.Config.Image}}' "$name" 2>/dev/null || true)"

start_container() {
  docker run -d --name "$name" --init --restart unless-stopped "$@" >/dev/null
}

wait_healthy() {
  for _ in $(seq 1 45); do
    state="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$name" 2>/dev/null || echo missing)"
    case "$state" in
      healthy) return 0 ;;
      exited|dead|missing) return 1 ;;
    esac
    sleep 2
  done
  return 1
}

docker rm -f "$name" >/dev/null 2>&1 || true
start_container "$@" "$image"

if wait_healthy; then
  echo "$name is healthy on $image"
  exit 0
fi

echo "$name failed health check on $image" >&2
docker logs --tail 60 "$name" >&2 || true
docker rm -f "$name" >/dev/null 2>&1 || true

if [ -n "$previous_image" ] && [ "$previous_image" != "$image" ]; then
  echo "rolling back $name to $previous_image" >&2
  start_container "$@" "$previous_image"
  if wait_healthy; then
    echo "rollback of $name succeeded" >&2
  else
    echo "rollback of $name failed" >&2
  fi
fi

exit 1
