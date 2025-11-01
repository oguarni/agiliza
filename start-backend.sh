#!/bin/bash

# Start Backend Server for Task Management System

echo "============================================"
echo "  Task Management System - Backend Server"
echo "============================================"
echo ""

# Check if Docker container is running
echo "🐳 Checking Docker PostgreSQL..."
if ! docker ps | grep -q task-postgres; then
    echo "⚠️  Docker PostgreSQL is not running!"
    echo "Starting Docker container..."
    docker start task-postgres
    sleep 3
    echo "✅ Docker PostgreSQL started"
else
    echo "✅ Docker PostgreSQL is running"
fi

echo ""
echo "🚀 Starting Backend Server..."
echo "   URL: http://localhost:3001"
echo "   Health: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo "============================================"
echo ""

cd backend
npm run dev
