#!/usr/bin/env bash

export DB_USERNAME="your-db-username"
export DB_PASSWORD="your-db-password"
export DB_HOST="localhost:5432"
export DB_NAME="metadata_school"

./validate-auth-keys.sh

mvn clean spring-boot:run
