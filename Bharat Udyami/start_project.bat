@echo off
title Bharat Udyami - 1-Click Launcher
echo ========================================================
echo        Starting Bharat Udyami Project...
echo ========================================================

cd /d "%~dp0"

echo Starting Backend API (Port 5000)...
start "Bharat Udyami - Backend" /min cmd /k "py backend\app.py"

timeout /t 2 /nobreak >nul

echo Starting Frontend Server (Port 5173)...
cd /d "%~dp0frontend"
start "Bharat Udyami - Frontend" /min cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo ========================================================
echo   Application started successfully!
echo   Frontend : http://localhost:5173
echo   Backend  : http://127.0.0.1:5000
echo ========================================================
