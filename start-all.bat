@echo off
echo Starting Ozy Sneakers - Backend and Frontend...
echo.

REM Start backend in a new window
start "Ozy Sneakers - Backend" cmd /k "cd /d "C:\Users\zed kign\Documents\Default Project\shoeswebsite\artifacts\api-server" && node --enable-source-maps --env-file="../../.env" ./dist/index.mjs"

REM Wait a few seconds so backend is up before frontend starts
timeout /t 5 /nobreak >nul

REM Start frontend in a new window
start "Ozy Sneakers - Frontend" cmd /k "cd /d "C:\Users\zed kign\Documents\Default Project\shoeswebsite\artifacts\ozy-snaker" && pnpm dev"

echo.
echo Both servers are starting in separate windows.
echo Wait a few seconds, then open http://localhost:5173 in your browser.
echo.
pause
