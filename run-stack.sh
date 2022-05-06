#!/usr/bin/env bash

set -e

# Environment variables provided to allow run stack for test not for production
export DB_PASSWORD=school_pass
export DB_NAME=metadata_school
export DB_USERNAME=school
export API_URL=localhost:9200
if [ ! -f "${CHECK_POINT}" ]; then
  echo "Check point for build images not found, building images from source"
  ./build-service-images.sh
fi

docker-compose up
