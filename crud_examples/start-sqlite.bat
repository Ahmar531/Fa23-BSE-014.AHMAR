@echo off
echo ========================================
echo Starting SQLite CRUD Application
echo ========================================
echo.
cd sqlite_crud
echo Installing dependencies...
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
echo.
echo Starting server on port 3002...
echo.
echo Open your browser: http://localhost:3002
echo.
echo Press Ctrl+C to stop the server
echo ========================================
node server.js
