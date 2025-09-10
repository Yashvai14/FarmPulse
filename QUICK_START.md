# 🚀 FarmPulse Quick Start Guide

## 🎯 Super Quick Setup (Copy & Paste Commands)

### For Windows Users:

1. **Download & Install Prerequisites:**
   - Node.js: https://nodejs.org/ (Download LTS version)
   - Python: https://www.python.org/downloads/ (Check "Add to PATH")
   - Git: https://git-scm.com/downloads

2. **Clone & Setup (Run in PowerShell/Command Prompt):**
   ```cmd
   # Navigate to where you want the project
   cd Desktop
   
   # Clone the project (replace with your repo URL)
   git clone <your-repo-url>
   cd farmpulse
   
   # Run automated setup
   setup.bat
   ```

3. **Get API Key & Configure:**
   - Visit: https://openweathermap.org/api
   - Sign up for free account
   - Copy your API key
   - Open `.env.local` file in notepad
   - Replace `your_openweather_api_key_here` with your actual key

4. **Start Application:**
   ```cmd
   # Option 1: Use start script
   start.bat
   
   # Option 2: Manual start (in 2 separate terminals)
   npm run dev
   # AND in another terminal:
   cd backend
   venv\Scripts\activate
   python main.py
   ```

### For macOS/Linux Users:

1. **Install Prerequisites:**
   ```bash
   # macOS (install Homebrew first if needed: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)")
   brew install node python git
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs npm python3 python3-pip git
   ```

2. **Clone & Setup:**
   ```bash
   # Navigate to desired directory
   cd ~/Desktop
   
   # Clone the project
   git clone <your-repo-url>
   cd farmpulse
   
   # Make scripts executable and run setup
   chmod +x setup.sh start.sh
   ./setup.sh
   ```

3. **Configure Environment:**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit the file and add your API key
   nano .env.local
   # or
   code .env.local
   ```

4. **Start Application:**
   ```bash
   # Option 1: Use start script
   ./start.sh
   
   # Option 2: Manual start (in 2 separate terminals)
   npm run dev
   # AND in another terminal:
   cd backend && source venv/bin/activate && python main.py
   ```

## 🌐 Access Your Application

Once running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## ⚡ Troubleshooting

### Common Issues:

**"Port 3000 already in use"**
```bash
# Kill the process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -ti:3000 | xargs kill -9  # macOS/Linux

# Or use different port
npm run dev -- -p 3001
```

**"Python/Node not found"**
- Make sure you installed them with "Add to PATH" option
- Restart your terminal/command prompt
- Try `python3` instead of `python` on macOS/Linux

**"Module not found"**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Environment variables not working**
- Make sure file is named `.env.local` (not `.env.local.txt`)
- Restart the development server after adding API keys
- Check that there are no spaces around the `=` sign

## 🎯 Next Steps After Setup

1. **Explore Features:**
   - 🌤️ Weather page: Real-time weather data
   - 🌱 Crop Suggestion: AI-powered recommendations
   - 🔬 Disease Predictor: Upload crop images for diagnosis
   - 📈 Market Prices: Live commodity prices
   - 📊 Dashboard: Farm management tools
   - 🗺️ Mapping: Environmental data visualization

2. **Customize:**
   - Modify colors in `tailwind.config.ts`
   - Add new features in the `app/(pages)/` directory
   - Update components in `components/` folder

3. **Deploy:**
   - Frontend: Vercel, Netlify, or other static hosting
   - Backend: Heroku, Railway, or cloud platforms

## 📞 Need Help?

- Check the full README.md for detailed documentation
- Look at the troubleshooting section
- Check that all prerequisites are properly installed
- Ensure API keys are correctly set in `.env.local`

**Happy Farming! 🌾**
