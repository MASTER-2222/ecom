#!/bin/bash

# Render deployment script for RitKART Frontend
echo "🚀 Starting RitKART Frontend deployment..."

# Clean install with legacy peer deps to handle React 19 compatibility
echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

# Build the application
echo "🔨 Building the application..."
npm run build

echo "✅ Deployment complete!"