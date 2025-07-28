#!/bin/bash

# Start ShareIt in tunnel mode (works with WSL2 networking issues)

echo "🚀 Starting ShareIt Docker in tunnel mode..."
echo "🔐 This bypasses WSL2 networking issues by using Expo's tunnel service"

# Run port detector
./docker/port-detector.sh

# Start container
docker-compose -f docker/docker-compose.tunnel.yml up -d

# Wait for startup
echo "⏳ Waiting for tunnel to establish..."
sleep 10

# Show logs
echo "📋 Container logs:"
docker logs shareit-dev --tail 30

echo ""
echo "✅ ShareIt is running in tunnel mode!"
echo "📱 Scan the QR code with Expo Go - it will work from anywhere!"
echo "🌐 The tunnel URL will be something like: exp://xx-xxx-xxx-xxx.ngrok.io"
echo ""
echo "🛑 To stop: docker-compose -f docker/docker-compose.tunnel.yml down"