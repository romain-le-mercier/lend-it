#!/bin/bash

# Port detection script for ShareIt
# Finds the first available port starting from 3847 (exotic range)

START_PORT=4847
MAX_PORT=4900

find_available_port() {
    local port=$START_PORT
    
    while [ $port -le $MAX_PORT ]; do
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo $port
            return 0
        fi
        ((port++))
    done
    
    echo "Error: No available ports found between $START_PORT and $MAX_PORT" >&2
    return 1
}

# Find available port
AVAILABLE_PORT=$(find_available_port)

if [ $? -eq 0 ]; then
    echo "Found available port: $AVAILABLE_PORT"
    
    # Update .env file
    if [ -f .env ]; then
        # Update existing PORT variable
        sed -i.bak "s/^PORT=.*/PORT=$AVAILABLE_PORT/" .env
        # If PORT doesn't exist, append it
        grep -q "^PORT=" .env || echo "PORT=$AVAILABLE_PORT" >> .env
    else
        # Create new .env file
        echo "PORT=$AVAILABLE_PORT" > .env
    fi
    
    # Export for immediate use
    export PORT=$AVAILABLE_PORT
    export EXPO_PACKAGER_PROXY_PORT=$((AVAILABLE_PORT + 1))
    
    echo "Environment configured:"
    echo "  PORT=$AVAILABLE_PORT"
    echo "  EXPO_PACKAGER_PROXY_PORT=$((AVAILABLE_PORT + 1))"
else
    exit 1
fi