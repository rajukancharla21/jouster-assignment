#!/bin/bash

# LLM Knowledge Extractor - Startup Script
echo "🚀 Starting LLM Knowledge Extractor..."

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env file not found!"
    echo "Please create backend/.env with your API keys:"
    echo "OPENAI_API_KEY=your_openai_api_key_here"
    echo "SUPABASE_URL=your_supabase_url_here"
    echo "SUPABASE_API_KEY=your_supabase_api_key_here"
    exit 1
fi

# Start backend in background with auto-reload
echo "🔧 Starting backend server with auto-reload..."
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --reload-dir . &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Both services started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
