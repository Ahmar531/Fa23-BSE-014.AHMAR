@echo off
echo ========================================
echo Starting All CRUD Applications
echo ========================================
echo.
echo NOTE: MongoDB and MySQL need their servers running!
echo SQLite will work without any setup.
echo.
echo Starting servers...
echo.

start "SQLite CRUD - Port 3002" cmd /k "cd sqlite_crud && node server.js"
timeout /t 2 /nobreak >nul

start "MongoDB CRUD - Port 3000" cmd /k "cd mongodb_crud && node server.js"
timeout /t 2 /nobreak >nul

start "MySQL CRUD - Port 3001" cmd /k "cd mysql_crud && node server.js"

echo.
echo ========================================
echo Servers Started!
echo ========================================
echo.
echo SQLite:  http://localhost:3002 (READY!)
echo MongoDB: http://localhost:3000 (needs mongod)
echo MySQL:   http://localhost:3001 (needs MySQL service)
echo.
echo Close the terminal windows to stop servers
echo ========================================
pause
