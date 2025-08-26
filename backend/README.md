# Ballerina Authentication System

A complete authentication system built with Ballerina and MySQL database featuring user registration, login, logout, and profile management.

## Features

- User Registration with validation
- User Login with session-based authentication  
- User Logout
- User Profile retrieval
- User Profile updates
- MySQL database integration
- Password hashing with SHA-256
- Session token management

## Prerequisites

1. **Ballerina** (2201.12.8 or later)
2. **MySQL Server** (5.7 or later)
3. **XAMPP** (for local MySQL setup)

## Database Setup

1. Start your MySQL server (via XAMPP or standalone)
2. Run the SQL script in `resources/database_setup.sql` to create the database and tables:

```sql
mysql -u root -p < resources/database_setup.sql
```

Or execute the commands manually:
```sql
CREATE DATABASE IF NOT EXISTS social_media_db;
USE social_media_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sessions table  
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Configuration

Update the database configuration in `Config.toml`:

```toml
dbHost = "localhost"
dbPort = 3306
dbName = "social_media_db"
dbUser = "root"
dbPassword = ""
```

## Build and Run

1. **Build the project:**
```bash
bal build
```

2. **Run the service:**
```bash
bal run
```

The authentication service will start on `http://localhost:8080`

## API Endpoints

### 1. Health Check
```
GET /health
```
**Response:**
```json
{
    "status": "OK",
    "message": "Authentication service is running"
}
```

### 2. User Registration
```
POST /register
Content-Type: application/json
```
**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john@example.com", 
    "password": "password123",
    "fullName": "John Doe"
}
```
**Response:**
```json
{
    "success": true,
    "message": "User registered successfully",
    "userId": 1
}
```

### 3. User Login
```
POST /login
Content-Type: application/json
```
**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```
**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "sessionToken": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "fullName": "John Doe"
    },
    "expiresAt": "2025-08-26T13:00:00.000Z"
}
```

### 4. User Logout
```
POST /logout
Authorization: Bearer <session_token>
```
**Response:**
```json
{
    "success": true,
    "message": "Logout successful"
}
```

### 5. Get User Profile
```
GET /profile
Authorization: Bearer <session_token>
```
**Response:**
```json
{
    "success": true,
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "createdAt": "2025-08-26T12:00:00",
        "updatedAt": null
    }
}
```

### 6. Update User Profile
```
PUT /profile
Authorization: Bearer <session_token>
Content-Type: application/json
```
**Request Body:**
```json
{
    "username": "john_updated"
}
```
**Response:**
```json
{
    "success": true,
    "message": "Username updated successfully"
}
```

## Usage Examples

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get profile (replace TOKEN with actual session token):**
```bash
curl -X GET http://localhost:8080/profile \
  -H "Authorization: Bearer TOKEN"
```

## Security Features

- **Password Hashing:** Uses SHA-256 for password encryption
- **Session Management:** Time-limited session tokens (1 hour expiry)
- **Input Validation:** Email format and required field validation
- **Duplicate Prevention:** Prevents duplicate usernames and emails
- **SQL Injection Prevention:** Uses parameterized queries

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/session)
- `404` - Not Found
- `409` - Conflict (duplicate user)
- `500` - Internal Server Error

## Development

### Project Structure
```
backend/
├── main.bal                    # Main service entry point
├── Config.toml                 # Configuration file
├── Ballerina.toml             # Project dependencies
├── modules/
│   └── auth/
│       └── auth_service.bal   # Authentication logic
└── resources/
    └── database_setup.sql     # Database schema
```

### Test Users

The database setup includes test users:
- **Username:** admin, **Email:** admin@example.com, **Password:** password123
- **Username:** testuser, **Email:** test@example.com, **Password:** password123

## Notes

- Session tokens expire after 1 hour
- Passwords are hashed using SHA-256 
- The system uses session-based authentication (simplified approach)
- Database tables are created automatically on first run
- All endpoints return JSON responses

## Future Enhancements

- JWT-based authentication
- Password reset functionality
- Email verification
- Role-based access control
- Rate limiting
- Advanced password validation
- Refresh token support
