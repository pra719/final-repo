#!/bin/bash

echo "🚀 Manual Setup for Secure File Sharing Application"
echo "=================================================="
echo ""
echo "This script will help you set up the application manually."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "Please edit backend/.env with your configuration"
fi

echo "📦 Installing backend dependencies..."
npm install

echo ""
echo "🔧 Setting up Frontend..."
cd ../frontend

if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
    echo "Please edit frontend/.env with your configuration"
fi

echo "📦 Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Make sure MongoDB is running on localhost:27017"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: cd frontend && npm start"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "💾 For MongoDB installation:"
echo "   - Ubuntu/Debian: sudo apt install mongodb"
echo "   - macOS: brew install mongodb-community"
echo "   - Windows: Download from https://www.mongodb.com/try/download/community"
echo ""