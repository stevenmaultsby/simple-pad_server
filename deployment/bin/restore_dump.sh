#!/bin/bash
cd $(dirname $(realpath ${BASH_SOURCE[0]}))/..
source .env

if [[ ! -f $1 ]]; then
    echo "Not such file: $1"
    exit
fi
FILE=$1
EXT="${FILE##*.}"
DATE=`date +"%Y-%m-%dT%H:%M:%S%z"`
if [[ $EXT = "gz" ]]; then
    gunzip --stdout $FILE > /tmp/dump_$DATE.sql
    FILE=/tmp/dump_$DATE.sql
fi
EXT="${FILE##*.}"
if [[ $EXT != 'sql' ]]; then
    echo "Not an SQL-file: $FILE"
    exit
fi
./exec.sh stop api
cat $FILE | ./exec.sh exec -T db psql -U $DB_USER template1
./exec.sh start api