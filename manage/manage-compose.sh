#!/bin/bash

stop() {
    echo "docker-compose stop"
    docker-compose stop

    echo "docker-compose remove"
    docker-compose rm -f

}

start() {

    echo "docker run --name <container_name> -p port:port -f <image_name> "
    docker-compose up -d
}


case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  *)
    echo "Usage: $0 start|stop" >&2
    exit 3
    ;;
esac
