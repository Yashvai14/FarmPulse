# 🌾 FarmPulse - AI-Powered Agricultural Management Platform

![FarmPulse Banner](https://img.shields.io/badge/FarmPulse-Agricultural%20AI-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)

FarmPulse is a comprehensive AI-powered agricultural management platform that provides farmers with intelligent crop recommendations, disease detection, weather insights, market price tracking, and farm management tools.

## 🚀 Quick Start (First Try Setup)

### Prerequisites Installation

1. **Install Node.js (v18.x or higher)**
   ```bash
   # Download from: https://nodejs.org/
   # Verify installation
   node --version
   npm --version
   ```

2. **Install Python (v3.8 or higher)**
   ```bash
   # Download from: https://www.python.org/downloads/
   # Verify installation
   python --version
   pip --version
   ```

3. **Install Git**
   ```bash
   # Download from: https://git-scm.com/downloads
   # Verify installation
   git --version
   ```

### One-Click Setup Commands

```bash
# Clone the repository
git clone <your-repo-url>
cd farmpulse

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Return to root directory
cd ..

# Set up environment variables (copy and modify)
copy .env.example .env.local

# Start the development servers
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (in a new terminal)
cd backend
python main.py
```

---

## 📋 Detailed Setup Guide

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | Windows 10/11, macOS 10.15+, Ubuntu 18.04+ | Latest versions |
| RAM | 8 GB | 16 GB |
| Storage | 5 GB free space | 10 GB free space |
| Internet | Stable connection | Broadband |

### 1. Software Installation

#### Node.js & npm
```bash
# Windows (using Chocolatey)
choco install nodejs

# macOS (using Homebrew)
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version   # Should be 9.x or higher
```

#### Python & pip
```bash
# Windows - Download from python.org and install
# Make sure to check "Add Python to PATH"

# macOS (using Homebrew)
brew install python@3.11

# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# Verify installation
python --version  # Should be 3.8 or higher
pip --version
```

#### Git
```bash
# Windows - Download from git-scm.com
# macOS - Usually pre-installed or install via Xcode Command Line Tools
xcode-select --install

# Ubuntu/Debian
sudo apt install git

# Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Project Setup

#### Clone Repository
```bash
# Clone the project
git clone <your-repo-url>
cd farmpulse

# Check project structure
dir  # Windows
ls   # macOS/Linux
```

#### Frontend Setup (Next.js)
```bash
# Install dependencies
npm install

# If you encounter permission issues on Windows:
npm install --force

# Verify package.json dependencies are installed
npm list --depth=0
```

#### Backend Setup (Python/FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# If you encounter issues, try upgrading pip first:
python -m pip install --upgrade pip
pip install -r requirements.txt

# Verify installations
pip list
```

### 3. Environment Configuration

#### Frontend Environment Variables
Create `.env.local` in the root directory:
```env
# Weather API Key (OpenWeatherMap)
NEXT_PUBLIC_OPENWEATHER_KEY=your_openweather_api_key

# Other API keys (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend Environment Variables
Create `.env` in the backend directory:
```env
# Database Configuration
DATABASE_URL=your_database_url

# API Keys
WEATHER_API_KEY=your_openweather_api_key

# Other configurations
DEBUG=True
```

#### Getting API Keys

1. **OpenWeatherMap API Key (Free)**
   - Visit: https://openweathermap.org/api
   - Sign up for free account
   - Generate API key
   - Add to `.env.local` as `NEXT_PUBLIC_OPENWEATHER_KEY`

2. **Supabase (Optional - for database)**
   - Visit: https://supabase.com
   - Create new project
   - Get URL and anon key from settings

### 4. Database Setup (Optional)

If using Supabase or local database:
```bash
# Install additional dependencies
npm install @supabase/supabase-js

# Run database migrations (if any)
npm run db:migrate
```

---

## 🏃‍♂️ Running the Application

### Development Mode

#### Method 1: Separate Terminals
```bash
# Terminal 1 - Frontend
npm run dev
# Runs on http://localhost:3000

# Terminal 2 - Backend
cd backend
python main.py
# Runs on http://localhost:8000
```

#### Method 2: Concurrent (if configured)
```bash
# Install concurrently
npm install -g concurrently

# Run both servers
npm run dev:all
```

### Production Build
```bash
# Build frontend
npm run build
npm run start

# Backend production (using uvicorn)
cd backend
pip install uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Accessing the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 🛠️ Project Structure

```
farmpulse/
├── app/                    # Next.js app directory
│   ├── (pages)/           # Feature pages
│   │   ├── crop-suggestion/
│   │   ├── dashboard/
│   │   ├── market-price/
│   │   ├── mapping/
│   │   ├── predictor/
│   │   └── weather/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Landing page
├── backend/               # Python FastAPI backend
│   ├── main.py           # Main FastAPI application
│   ├── predict_crop.py   # Crop prediction model
│   ├── train_crop_model.py # Model training
│   ├── remedies.json     # Disease remedies data
│   └── requirements.txt  # Python dependencies
├── components/           # React components
│   ├── CropForm.tsx     # Crop suggestion form
│   ├── feature.tsx      # Features section
│   ├── MapComponent.tsx # Map integration
│   ├── navBar.tsx       # Navigation bar
│   └── ...
├── lib/                 # Utilities and API clients
├── public/              # Static assets
├── package.json         # Node.js dependencies
├── tailwind.config.ts   # Tailwind CSS config
├── tsconfig.json        # TypeScript config
└── README.md           # This file
```

---

## 🔧 Dependencies & Versions

### Frontend Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "axios": "^1.5.0",
    "leaflet": "^1.9.0",
    "papaparse": "^5.4.1"
  }
}
```

### Backend Dependencies
```txt
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
pandas==2.1.0
scikit-learn==1.3.0
numpy==1.24.0
pillow==10.0.1
python-dotenv==1.0.0
```

### Compatible Versions
- **Node.js**: 18.x - 20.x
- **Python**: 3.8 - 3.11
- **npm**: 9.x or higher
- **pip**: 21.x or higher

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. Port Already in Use
```bash
# Find and kill process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -ti:3000 | xargs kill -9  # macOS/Linux

# Or use different ports
npm run dev -- -p 3001
```

#### 2. Module Not Found Errors
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 3. Python Import Errors
```bash
# Ensure virtual environment is activated
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

#### 4. API Key Issues
```bash
# Verify environment variables are loaded
# In your terminal, check:
echo $NEXT_PUBLIC_OPENWEATHER_KEY  # macOS/Linux
echo %NEXT_PUBLIC_OPENWEATHER_KEY%  # Windows
```

#### 5. Database Connection Issues
```bash
# Check database URL in .env
# Test connection manually
# Ensure database server is running
```

---

## 📱 Features Overview

### 🌤️ **Weather Intelligence**
- Real-time weather data
- 5-day forecasts
- Agricultural advisories
- Climate alerts

### 🌱 **AI Crop Recommendations**
- Soil-based analysis
- Market price integration
- ML-powered suggestions
- Profit optimization

### 🔬 **Disease Detection**
- Image-based diagnosis
- Treatment recommendations
- Multilingual support
- Early detection alerts

### 📈 **Market Price Tracking**
- Live mandi prices
- Price trend analysis
- State-wise filtering
- Profit optimization

### 📊 **Farm Dashboard**
- Task management
- Progress tracking
- Analytics & insights
- Centralized control

### 🗺️ **Environmental Mapping**
- Interactive farm maps
- Soil & weather data
- Location-based insights
- Environmental tips

---

## 🎨 Design System

| Purpose       | Color Name        | Hex Code  | Usage                             |
| ------------- | ----------------- | --------- | --------------------------------- |
| 🌿 Primary    | Lime Green        | `#65A30D` | Buttons, highlights, main accents |
| 🏞️ Secondary | Light Green       | `#D9F99D` | Backgrounds, soft sections        |
| ☀️ Accent     | Blue Gradient     | `#3B82F6` | Weather, water-related features   |
| 🌊 Teal       | Teal Green        | `#0D9488` | Maps, environmental data          |
| ☁️ Base       | Off-White         | `#F9FAFB` | Backgrounds                       |
| 🪵 Text/Dark  | Gray              | `#1F2937` | Headings, primary text            |
| 💬 Subtext    | Light Gray        | `#6B7280` | Descriptions, subtext             |
| 📱 Outline    | Border Gray       | `#E5E7EB` | Card borders, dividers            |

---

## 🔐 Security & Privacy

- API keys stored in environment variables
- No sensitive data in version control
- Secure API endpoints
- User data protection

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### Getting Help
- **Issues**: Create an issue on GitHub
- **Documentation**: Check this README
- **Email**: your-email@example.com

### Useful Commands
```bash
# View all npm scripts
npm run

# Check dependency versions
npm list
pip list

# Update dependencies
npm update
pip install --upgrade -r requirements.txt

# Clean installation
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode
```bash
# Frontend debug
npm run dev -- --debug

# Backend debug
cd backend
python main.py --debug
```

---

## 🎯 Next Steps

1. **API Keys**: Set up OpenWeatherMap API key
2. **Database**: Configure Supabase or local database
3. **Customization**: Modify features as needed
4. **Deployment**: Deploy to Vercel/Netlify (frontend) and Heroku/Railway (backend)

---

**Happy Farming with FarmPulse! 🌾**

For the latest updates and detailed documentation, visit our [GitHub repository](https://github.com/your-username/farmpulse).
