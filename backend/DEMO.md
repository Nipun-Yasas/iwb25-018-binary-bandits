# Quick Start Demo

## 1. Prerequisites

Before running the authentication system, ensure you have:

- **Ballerina 2201.12.8** or later installed
- **MySQL Server** running (XAMPP recommended for Windows)
- **curl** or a REST client like Postman

## 2. Setup MySQL Database

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin or MySQL command line
3. Create the database:

```sql
CREATE DATABASE social_media_db;
USE social_media_db;
```

4. Run the database setup script:
```bash
mysql -u root -p social_media_db < resources/database_setup.sql
```

Or create tables manually:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 3. Start the Service

```bash
cd backend
bal run
```

You should see:
```
Compiling source
        user/backend:0.1.0
[ballerina/http] started HTTP/WS listener 0.0.0.0:8080
2025-08-26 12:00:00,000 INFO [user.backend] - Database tables initialized successfully
```

## 4. Test the API

### Health Check
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
    "status": "OK",
    "message": "Authentication service is running"
}
```

### Register User
```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

Expected response:
```json
{
    "success": true,
    "message": "User registered successfully",
    "userId": 1
}
```

### Login
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
    "success": true,
    "message": "Login successful",
    "sessionToken": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe"
    },
    "expiresAt": "2025-08-26T13:00:00.000Z"
}
```

### Get Profile (use token from login response)
```bash
curl -X GET http://localhost:8080/profile \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000"
```

### Update Profile
```bash
curl -X PUT http://localhost:8080/profile \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_updated"
  }'
```

### Logout
```bash
curl -X POST http://localhost:8080/logout \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000"
```

## 5. Troubleshooting

### Connection Error
If you get database connection errors:
1. Ensure MySQL is running
2. Check database credentials in `Config.toml`
3. Verify database name exists

### Build Errors
If compilation fails:
1. Ensure Ballerina version is 2201.12.8+
2. Run `bal clean` then `bal build`
3. Check for syntax errors in the code

### API Not Responding
1. Check if port 8080 is available
2. Verify service started successfully
3. Check firewall settings

## 6. Project Structure

```
backend/
├── main.bal                    # HTTP service and main function
├── Config.toml                 # Database configuration
├── Ballerina.toml             # Project metadata
├── modules/
│   └── auth/
│       └── auth_service.bal   # Authentication functions
├── resources/
│   └── database_setup.sql     # Database schema
├── README.md                  # Full documentation
└── DEMO.md                    # This quick start guide
```

The authentication system is now ready for use!
