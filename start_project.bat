@echo off
title Bharat Udyami Launcher
echo ========================================================
echo        Starting Bharat Udyami Project...
echo ========================================================

cd /d "%~dp0\Bharat Udyami"

echo Starting Backend API (Port 5000)...
start "Bharat Udyami - Backend" cmd /k "py backend\app.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (Port 5173)...
cd /d "%~dp0\Bharat Udyami\frontend"
start "Bharat Udyami - Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo Application is running!
echo Frontend: http://localhost:5173
echo Backend API: http://127.0.0.1:5000
echo ========================================================
