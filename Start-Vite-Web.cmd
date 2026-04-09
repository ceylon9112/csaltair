@echo off
title Jazz Fest - Vite web
cd /d "%~dp0"
echo Installing patron-web deps if needed...
call npm install --prefix patron-web --no-audit --no-fund
if errorlevel 1 exit /b 1
echo.
echo Starting Vite. Keep this window OPEN — then use http://127.0.0.1:5173 in Chrome/Edge
echo (ERR_CONNECTION_REFUSED means this server is not running.)
echo.
call npm --prefix patron-web run dev
pause
