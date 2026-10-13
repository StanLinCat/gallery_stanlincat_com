@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js not found. Please install it from https://nodejs.org & pause & exit /b 1)
node scripts\prepare-photos.mjs --open
echo.
pause
