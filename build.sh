#!/bin/sh
export BUILD_VERSION=$(cat package.json | grep -e '"version":' | tr -cd "[0-9].")
docker-compose down && docker-compose up -d