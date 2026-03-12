#!/bin/bash
cd $(dirname $(realpath ${BASH_SOURCE[0]}))/..
source .env
DATE=`date +"%Y-%m-%dT%H:%M:%S%z"`
mkdir -p ./pgdumps/
./exec.sh exec db pg_dump --clean --create -U $DB_USER $DB_NAME > ./pgdumps/$DATE.sql
gzip ./pgdumps/$DATE.sql
echo "./pgdumps/$DATE.sql.gz dump was created"