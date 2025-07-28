#!/bin/bash

# Get the host IP address for Docker container networking
# Prioritizes common network interfaces

# Try to get IP from various methods
if command -v ip &> /dev/null; then
    # Try to get IP from default route interface
    DEFAULT_IF=$(ip route | grep default | awk '{print $5}' | head -n1)
    if [ ! -z "$DEFAULT_IF" ]; then
        IP=$(ip addr show "$DEFAULT_IF" | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -n1)
    fi
fi

# If that didn't work, try hostname -I
if [ -z "$IP" ] && command -v hostname &> /dev/null; then
    IP=$(hostname -I | awk '{print $1}')
fi

# If still no IP, try ifconfig
if [ -z "$IP" ] && command -v ifconfig &> /dev/null; then
    IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1)
fi

# Default to localhost if nothing found
if [ -z "$IP" ]; then
    IP="127.0.0.1"
fi

echo "$IP"