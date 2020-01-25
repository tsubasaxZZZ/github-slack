#!/bin/sh

if [ -e .env ]; then
    echo "Load Environment variable from .env file."
    exit 0
fi

if [ -z "$ENV_URL" ]; then
    echo "ENV_URL doesn't set."
    exit 1
fi

curl "$ENV_URL" -o .env
