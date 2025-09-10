@echo off
echo ====================================
echo      Starting FarmPulse Backend
echo ====================================
echo.

:: Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python and add it to PATH
    pause
    exit /b 1
)

:: Check if virtual environment exists
if not exist venv (
    echo WARNING: Virtual environment not found!
    echo Creating virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
)

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment!
    pause
    exit /b 1
)

:: Install dependencies if requirements.txt exists
if exist requirements.txt (
    echo Installing Python dependencies...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo WARNING: Some dependencies might not have installed correctly
    )
)

:: Start the server
echo.
echo Starting FastAPI server...
echo Server will be available at: http://localhost:8000
echo API Documentation at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python main.py

echo.
echo Server stopped.
pause
