#!/bin/bash

# Secure File Sharing - Restart Script
echo "🚀 Restarting Secure File Sharing Application..."
echo "=================================================="

# Stop all containers
echo "🛑 Stopping existing containers..."
docker compose down

# Remove any orphaned containers
echo "🧹 Cleaning up..."
docker compose down --remove-orphans

# Rebuild and start services
echo "🔨 Building and starting services..."
docker compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker compose ps

echo ""
echo "✅ Application should be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   MongoDB:  localhost:27017"
echo ""
echo "📝 To view logs:"
echo "   docker compose logs -f backend"
echo "   docker compose logs -f frontend"
echo "   docker compose logs -f mongo"
echo ""
echo "🔍 To test backend connectivity:"
echo "   curl http://localhost:5000/api/test"