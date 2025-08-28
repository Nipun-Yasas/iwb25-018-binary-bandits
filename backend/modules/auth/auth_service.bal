import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;
import ballerina/crypto;
import ballerina/uuid;
import ballerina/time;
import ballerina/log;

// User registration record
public type UserRegistration record {
    string username;
    string email;
    string password;
    string? fullName;
};

// User login record
public type UserLogin record {
    string email;
    string password;
};

// User update record
public type UserUpdate record {
    string? username;
    string? fullName;
    string? email;
};

// User record from database
public type User record {
    int id;
    string username;
    string email;
    string password_hash;
    string? full_name;
    string created_at;
    string? updated_at;
};

// Initialize database tables
public function initializeDatabase(mysql:Client dbClient) returns error? {
    // Create users table if not exists
    _ = check dbClient->execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    
    // Create sessions table for session management
    _ = check dbClient->execute(`
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            session_token VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
    
    log:printInfo("Database tables initialized successfully");
    return;
}

// Register a new user
public function registerUser(mysql:Client dbClient, UserRegistration userReg) returns http:Response|error {
    http:Response response = new;
    
    // Validate input
    if userReg.username.trim() == "" || userReg.email.trim() == "" || userReg.password.trim() == "" {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": "Username, email, and password are required"
        });
        return response;
    }
    
    // Validate email format (basic validation)
    if !isValidEmail(userReg.email) {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": "Invalid email format"
        });
        return response;
    }
    
    // Check if user already exists
    stream<record {int id;}, error?> userStream = dbClient->query(
        `SELECT id FROM users WHERE email = ${userReg.email} OR username = ${userReg.username}`
    );
    
    record {int id;}[]|error users = from record {int id;} user in userStream select user;
    check userStream.close();
    
    if users is record {int id;}[] && users.length() > 0 {
        response.statusCode = 409;
        response.setJsonPayload({
            "success": false,
            "message": "User with this email or username already exists"
        });
        return response;
    }
    
    // Hash password
    string hashedPassword = crypto:hashSha256(userReg.password.toBytes()).toBase16();
    
    // Insert new user
    sql:ExecutionResult result = check dbClient->execute(`
        INSERT INTO users (username, email, password_hash, full_name) 
        VALUES (${userReg.username}, ${userReg.email}, ${hashedPassword}, ${userReg.fullName})
    `);
    
    if result.affectedRowCount > 0 {
        // Get the newly created user
        stream<User, error?> newUserStream = dbClient->query(
            `SELECT id, username, email, password_hash, full_name, created_at FROM users WHERE id = ${result.lastInsertId}`
        );
        
        User[]|error newUsers = from User user in newUserStream select user;
        check newUserStream.close();
        
        if newUsers is User[] && newUsers.length() > 0 {
            User newUser = newUsers[0];
            
            // Generate session token for auto-login
            string sessionToken = uuid:createType1AsString();
            time:Utc currentTime = time:utcNow();
            time:Utc expiryTime = time:utcAddSeconds(currentTime, 3600); // 1 hour
            
            // Store session in database
            sql:ExecutionResult sessionResult = check dbClient->execute(`
                INSERT INTO user_sessions (user_id, session_token, expires_at) 
                VALUES (${newUser.id}, ${sessionToken}, ${time:utcToString(expiryTime)})
            `);
            
            if sessionResult.affectedRowCount > 0 {
                response.statusCode = 201;
                response.setJsonPayload({
                    "success": true,
                    "message": "User registered and logged in successfully",
                    "userId": result.lastInsertId,
                    "sessionToken": sessionToken,
                    "user": {
                        "id": newUser.id,
                        "username": newUser.username,
                        "email": newUser.email,
                        "fullName": newUser.full_name
                    },
                    "expiresAt": time:utcToString(expiryTime)
                });
            } else {
                response.statusCode = 201;
                response.setJsonPayload({
                    "success": true,
                    "message": "User registered successfully but failed to create session",
                    "userId": result.lastInsertId
                });
            }
        } else {
            response.statusCode = 201;
            response.setJsonPayload({
                "success": true,
                "message": "User registered successfully",
                "userId": result.lastInsertId
            });
        }
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to register user"
        });
    }
    
    return response;
}

// Login user
public function loginUser(mysql:Client dbClient, UserLogin userLogin) returns http:Response|error {
    http:Response response = new;
    
    // Validate input
    if userLogin.email.trim() == "" || userLogin.password.trim() == "" {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": "Email and password are required"
        });
        return response;
    }
    
    // Hash the provided password to compare
    string hashedPassword = crypto:hashSha256(userLogin.password.toBytes()).toBase16();
    
    // Find user by email
    stream<User, error?> userStream = dbClient->query(
        `SELECT id, username, email, password_hash, full_name, created_at FROM users WHERE email = ${userLogin.email}`
    );
    
    User[]|error users = from User user in userStream select user;
    check userStream.close();
    
    if users is error || users.length() == 0 {
        response.statusCode = 401;
        response.setJsonPayload({
            "success": false,
            "message": "Invalid email or password"
        });
        return response;
    }
    
    User user = users[0];
    
    // Verify password
    if user.password_hash != hashedPassword {
        response.statusCode = 401;
        response.setJsonPayload({
            "success": false,
            "message": "Invalid email or password"
        });
        return response;
    }
    
    // Generate session token
    string sessionToken = uuid:createType1AsString();
    time:Utc currentTime = time:utcNow();
    time:Utc expiryTime = time:utcAddSeconds(currentTime, 3600); // 1 hour
    
    // Store session in database
    sql:ExecutionResult sessionResult = check dbClient->execute(`
        INSERT INTO user_sessions (user_id, session_token, expires_at) 
        VALUES (${user.id}, ${sessionToken}, ${time:utcToString(expiryTime)})
    `);
    
    if sessionResult.affectedRowCount > 0 {
        response.statusCode = 200;
        response.setJsonPayload({
            "success": true,
            "message": "Login successful",
            "sessionToken": sessionToken,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "fullName": user.full_name
            },
            "expiresAt": time:utcToString(expiryTime)
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to create session"
        });
    }
    
    return response;
}

// Logout user
public function logoutUser(string sessionToken) returns http:Response|error {
    http:Response response = new;
    
    // Validate session token
    if sessionToken.trim() == "" {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": "Session token is required"
        });
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "message": "Logout successful"
    });
    
    return response;
}

// Get user profile
public function getUserProfile(mysql:Client dbClient, string sessionToken) returns http:Response|error {
    http:Response response = new;
    
    // Validate session
    User|http:Response|error userOrError = validateSession(dbClient, sessionToken);
    
    if userOrError is http:Response {
        return userOrError; // Return error response
    }
    
    if userOrError is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Session validation failed"
        });
        return response;
    }
    
    User user = <User>userOrError;
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "fullName": user.full_name,
            "createdAt": user.created_at,
            "updatedAt": user.updated_at
        }
    });
    
    return response;
}

// Update user profile (simplified version)
public function updateUserProfile(mysql:Client dbClient, string sessionToken, UserUpdate userUpdate) returns http:Response|error {
    http:Response response = new;
    
    // Validate session
    User|http:Response|error userOrError = validateSession(dbClient, sessionToken);
    
    if userOrError is http:Response {
        return userOrError; // Return error response
    }
    
    if userOrError is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Session validation failed"
        });
        return response;
    }
    
    User user = <User>userOrError;
    
    // Update only username for simplicity
    if userUpdate.username is string && userUpdate.username != "" {
        sql:ExecutionResult result = check dbClient->execute(`
            UPDATE users SET username = ${userUpdate.username} WHERE id = ${user.id}
        `);
        
        if result.affectedRowCount > 0 {
            response.statusCode = 200;
            response.setJsonPayload({
                "success": true,
                "message": "Username updated successfully"
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Failed to update username"
            });
        }
    } else {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": "Username is required for update"
        });
    }
    
    return response;
}

// Helper function to validate session
function validateSession(mysql:Client dbClient, string sessionToken) returns User|http:Response|error {
    http:Response response = new;
    
    if sessionToken.trim() == "" {
        response.statusCode = 401;
        response.setJsonPayload({
            "success": false,
            "message": "Session token is required"
        });
        return response;
    }
    
    // Check if session exists and is valid
    stream<record {int user_id; string expires_at;}, error?> sessionStream = dbClient->query(
        `SELECT user_id, expires_at FROM user_sessions 
         WHERE session_token = ${sessionToken} AND is_active = TRUE`
    );
    
    record {int user_id; string expires_at;}[]|error sessions = from record {int user_id; string expires_at;} session in sessionStream select session;
    _ = check sessionStream.close();
    
    if sessions is error || sessions.length() == 0 {
        response.statusCode = 401;
        response.setJsonPayload({
            "success": false,
            "message": "Invalid or expired session"
        });
        return response;
    }
    
    // Get user details
    int userId = sessions[0].user_id;
    stream<User, error?> userStream = dbClient->query(
        `SELECT id, username, email, password_hash, full_name, created_at, updated_at FROM users WHERE id = ${userId}`
    );
    
    User[]|error users = from User user in userStream select user;
    _ = check userStream.close();
    
    if users is error || users.length() == 0 {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": "User not found"
        });
        return response;
    }
    
    return users[0];
}

// Helper function to validate email format
function isValidEmail(string email) returns boolean {
    // Basic email validation
    return email.includes("@") && email.includes(".") && email.length() > 5;
}
