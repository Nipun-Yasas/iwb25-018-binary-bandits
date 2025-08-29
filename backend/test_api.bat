@echo off
echo Testing Ballerina Authentication API
echo.

echo 1. Testing Health Check...
curl -s http://localhost:8080/health
echo.
echo.

echo 2. Testing User Registration...
curl -s -X POST http://localhost:8080/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"testuser\", \"email\": \"test@example.com\", \"password\": \"password123\", \"fullName\": \"Test User\"}"
echo.
echo.

echo 3. Testing User Login...
for /f "tokens=*" %%i in ('curl -s -X POST http://localhost:8080/login -H "Content-Type: application/json" -d "{\"email\": \"test@example.com\", \"password\": \"password123\"}"') do set LOGIN_RESPONSE=%%i
echo %LOGIN_RESPONSE%
echo.

echo 4. Testing Get Profile (you'll need to extract the token manually)...
echo curl -X GET http://localhost:8080/profile -H "Authorization: Bearer YOUR_TOKEN_HERE"
echo.

echo 5. Testing Logout...
echo curl -X POST http://localhost:8080/logout -H "Authorization: Bearer YOUR_TOKEN_HERE"
echo.

pause
