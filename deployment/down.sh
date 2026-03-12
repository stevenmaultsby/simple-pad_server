#!/bin/bash

docker compose \
	-f db-compose.yml \
    -f api-compose.yml \
	-f nginx-compose.yml \
	down $@
