#!/usr/bin/env bash

echo "Building API jar"
mvn clean package

./validate-auth-keys.sh

IMAGE_NAME="school-api"
docker build . -t ${IMAGE_NAME}

