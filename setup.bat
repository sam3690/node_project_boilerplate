@echo off
echo ========================================
echo Node React MSSQL Boilerplate Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
echo Installing root dependencies...
call npm install
echo.

echo Installing server dependencies...
cd server
call npm install
cd ..
echo.

echo Installing client dependencies...
cd client
call npm install
cd ..
echo.

echo Step 2: Setting up environment files...
if not exist "server\.env" (
    echo Creating server .env file from template...
    copy "server\.env.example" "server\.env"
    echo Please edit server\.env with your database configuration
) else (
    echo Server .env file already exists
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure your MSSQL database connection in server\.env
echo 2. Create your database and run the schema from server\database\schema.sql
echo 3. Run 'npm run dev' to start both server and client
echo.
echo Database setup:
echo 1. Open MSSQL Server Management Studio
echo 2. Create a new database (e.g., 'node_react_boilerplate')
echo 3. Execute the SQL script in server\database\schema.sql
echo 4. Update server\.env with your database details
echo.
echo To start the application:
echo npm run dev
echo.
pause
