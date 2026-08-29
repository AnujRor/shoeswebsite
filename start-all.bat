@echo off
cd /d "%~dp0"
echo Starting Ozy Sneakers - Backend and Frontend with a single command...
echo Press Ctrl+C in this window to stop both servers.
echo.
call pnpm run dev
pause