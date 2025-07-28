#!/bin/bash

# Start Expo with proper WSL2 configuration
echo "🚀 Starting ShareIt for WSL2..."

# Get WSL IP
WSL_IP=$(hostname -I | awk '{print $1}')
echo "📡 Using WSL IP: $WSL_IP"

# Export environment variables
export REACT_NATIVE_PACKAGER_HOSTNAME=$WSL_IP
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

echo "🔧 Starting Expo..."
echo "📱 Make sure your phone is connected to the same WiFi network"
echo "🌐 Your computer's IP is: $WSL_IP"
echo ""

# Start Expo
npx expo start

echo ""
echo "💡 If you still can't connect:"
echo "1. Press 'd' to open developer menu"
echo "2. Select 'tunnel' connection type"
echo "3. Wait for the tunnel URL (may take 1-2 minutes)"
echo ""