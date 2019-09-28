#!/bin/bash


install() {
  echo "build image mfg-4b-sz"
  docker build -t mfg-4b-sz:v1 .
}

remove() {
    containerid=$(docker ps -a | grep mfg-4b-sz | awk '{print $1}')
    if [ -n "$containerid" ]; then
        echo "remove container mfg-4b-sz"
        docker rm mfg-4b-sz
    fi

    image_id=$(docker images | grep mfg-4b-sz | awk '{print $3}')
    if [ -n "$image_id" ]; then
        echo "remove image ${image_id}"
        docker rmi ${image_id}
    fi
}

stop() {
    containerid=$(docker ps -a | grep mfg-4b-sz | awk '{print $1}')
    if [ -n "$containerid" ]; then
        echo "stop mfg-4b-sz"
        docker stop mfg-4b-sz
    fi
}

start() {

    echo "docker run --name <container_name> -p port:port -f <image_name> "
    docker run --name mfg-4b-sz -p 80:80 -d mfg-4b-sz:v1
}

compose() {
    echo "Run docker-compose"
}

case "$1" in
  install)
    install
    ;;
  remove)
    stop
    remove
    ;;
  start)
    start
    ;;
  stop)
    stop
    ;;
  compose)
    compose
    ;;
  *)
    echo "Usage: $0 install|remove|start|stop" >&2
    exit 3
    ;;
esac
