#!/bin/bash

# Start ShareIt development Docker container with proper network configuration

echo "🚀 Starting ShareIt Docker development environment..."

# Get the host IP
HOST_IP=$(./docker/get-host-ip.sh)
echo "📡 Using host IP: $HOST_IP"

# Export for docker-compose
export HOST_IP

# Run port detector
echo "🔍 Detecting available port..."
./docker/port-detector.sh

# Source the .env to get the PORT
source .env

echo "🐳 Starting Docker container on port $PORT..."
docker-compose -f docker/docker-compose.yml up -d

# Wait for container to be ready
echo "⏳ Waiting for container to start..."
sleep 5

# Show logs
echo "📋 Container logs:"
docker logs shareit-dev --tail 30

echo ""
echo "✅ ShareIt development environment is ready!"
echo "📱 Scan the QR code above with Expo Go app"
echo "🌐 Expo DevTools: http://localhost:19001"
echo "📡 Make sure your phone is on the same network as IP: $HOST_IP"
echo ""
echo "💡 Tips for connection issues:"
echo "  - Ensure your phone and computer are on the same WiFi network"
echo "  - Check firewall settings (ports 19000, 19001 need to be open)"
echo "  - Try using tunnel mode: press 'd' in the terminal and select 'tunnel'"
echo ""
echo "🛑 To stop: docker-compose -f docker/docker-compose.yml down"