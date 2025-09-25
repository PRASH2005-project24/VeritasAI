@echo off
echo Starting VeritasAI Servers...

REM Kill any existing node processes
echo Stopping any existing servers...
taskkill /f /im node.exe >nul 2>&1

echo.
echo Starting Backend Server...
cd /d "%~dp0backend"
start "VeritasAI Backend" cmd /k "node server.js"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
cd /d "%~dp0frontend"
start "VeritasAI Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to check server status...
pause >nul

echo.
echo Checking server status...
netstat -ano | findstr ":3001 :5173"

echo.
echo Testing backend health...
curl http://localhost:3001/health 2>nul | find "status"

echo.
echo Setup complete! You can now use VeritasAI.
pause