#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "===================================="
echo "    FarmPulse Quick Setup Script"
echo "===================================="
echo

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

# Check if Node.js is installed
echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo "Please install Node.js first:"
    echo "  macOS: brew install node"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  Or download from: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed ($NODE_VERSION)"
fi

# Check if Python is installed
echo "[2/5] Checking Python installation..."
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    print_error "Python is not installed!"
    echo "Please install Python first:"
    echo "  macOS: brew install python"
    echo "  Ubuntu/Debian: sudo apt install python3 python3-pip"
    echo "  Or download from: https://python.org/"
    exit 1
else
    if command -v python3 &> /dev/null; then
        PYTHON_CMD=python3
        PIP_CMD=pip3
    else
        PYTHON_CMD=python
        PIP_CMD=pip
    fi
    PYTHON_VERSION=$($PYTHON_CMD --version)
    print_success "Python is installed ($PYTHON_VERSION)"
fi

# Install frontend dependencies
echo "[3/5] Installing frontend dependencies..."
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies!"
    exit 1
fi

# Install backend dependencies
echo "[4/5] Installing backend dependencies..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
if $PYTHON_CMD -m venv venv; then
    print_success "Virtual environment created"
else
    print_error "Failed to create virtual environment!"
    cd ..
    exit 1
fi

# Activate virtual environment and install dependencies
echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python packages..."
if $PIP_CMD install -r requirements.txt; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install Python dependencies!"
    cd ..
    exit 1
fi

cd ..

# Setup environment file
echo "[5/5] Setting up environment file..."
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        print_success "Environment file created (.env.local)"
        print_warning "Please edit .env.local and add your API keys!"
    else
        print_warning ".env.example not found. Please create .env.local manually."
    fi
else
    print_success "Environment file already exists"
fi

echo
echo "===================================="
echo "         Setup Complete!"
echo "===================================="
echo
echo "Next steps:"
echo "1. Edit .env.local and add your OpenWeatherMap API key"
echo "2. Get your free API key from: https://openweathermap.org/api"
echo "3. Run the application:"
echo
echo "   Frontend: npm run dev"
echo "   Backend:  cd backend && source venv/bin/activate && python main.py"
echo
echo "Visit: http://localhost:3000 to see your application!"
echo

# Make the script executable
chmod +x "$0"
