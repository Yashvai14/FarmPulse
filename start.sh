#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "===================================="
echo "     Starting FarmPulse Application"
echo "===================================="
echo

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}WARNING:${NC} .env.local file not found!"
    echo "Please copy .env.example to .env.local and add your API keys."
    echo "Run: cp .env.example .env.local"
    echo
    exit 1
fi

echo "Starting development servers..."
echo
echo -e "Frontend will run on: ${GREEN}http://localhost:3000${NC}"
echo -e "Backend will run on: ${GREEN}http://localhost:8000${NC}"
echo
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo

# Function to cleanup background processes
cleanup() {
    echo
    echo "Shutting down servers..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup SIGINT

# Start frontend in background
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 2

# Start backend in background
echo "Starting backend server..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

echo
echo -e "${GREEN}✓${NC} Both servers are running!"
echo
echo "Open your browser and visit:"
echo -e "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend API: ${GREEN}http://localhost:8000/docs${NC}"
echo
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for background processes
wait $FRONTEND_PID $BACKEND_PID
