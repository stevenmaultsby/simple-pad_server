#!/bin/bash
read -r -d  '' COMPOSES << EOM
	-f db-compose.yml \
	-f api-compose.yml \
	-f nginx-compose.yml
EOM

#docker compose \
#	$COMPOSES \
#	pull $@;
docker compose \
	$COMPOSES \
	up --detach;
docker compose \
	$COMPOSES \
	restart nginx
