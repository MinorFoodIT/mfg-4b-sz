#!/bin/bash

stop() {
    echo "docker-compose stop"
    docker-compose stop

    echo "docker-compose remove"
    docker-compose rm -f

}

remove() {
    docker-compose down
}

start() {

    echo "docker compose run with build image "
    docker-compose up -d --build
}

db-table-setup() {
    echo "create tables"
    cat db/create-tables.sql | docker exec -i mfg-4b-sz_db_1 /usr/bin/mysql -u root --password=root storeasservice

    echo "setup sites"
    cat db/sites.sql | docker exec -i mfg-4b-sz_db_1 /usr/bin/mysql -u root --password=root storeasservice

    echo "setup process_configuration"
    cat db/process_configuration.sql | docker exec -i mfg-4b-sz_db_1 /usr/bin/mysql -u root --password=root storeasservice

    echo "setup status_configuration"
    cat db/status_configuration.sql | docker exec -i mfg-4b-sz_db_1 /usr/bin/mysql -u root --password=root storeasservice

}

db-backup() {
    # Backup
    docker exec mfg-4b-sz_db_1 /usr/bin/mysqldump -u root --password=root storeasservice > backup.sql
}

db-restore() {
    # Backup
    cat backup.sql | docker exec -i mfg-4b-sz_db_1 /usr/bin/mysql -u root --password=root storeasservice
}

db-insert-user() {
    echo "insert user"
    cat user/user.sql | docker exec -i mfg-4b-sz_db_1 /usr/bin/mysql -u root --password=root storeasservice
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  remove)
     remove
     ;;
  db-table-setup)
     db-table-setup
     ;;
  db-insert-user)
     db-insert-user
     ;;
  db-restore)
     db-restore
     ;;
  db-backup)
     db-backup
     ;;
  *)
    echo "Usage: $0 start|stop|remove" >&2
    exit 3
    ;;
esac
