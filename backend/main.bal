import ballerina/http;
import ballerinax/mysql;
import backend.auth;

// Database configuration
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "binary_bandits";
configurable string dbUser = "root";
configurable string dbPassword = "";

// MySQL client
mysql:Client dbClient = check new (
    host = dbHost,
    port = dbPort,
    database = dbName,
    user = dbUser,
    password = dbPassword
);

// HTTP service with CORS configuration
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: true,
        allowHeaders: ["Authorization", "Content-Type"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}
service / on new http:Listener(8080) {
    
    // Health check endpoint
    resource function get hello() returns json {
        return {
            "status": "OK",
            "message": "Authentication service is running"
        };
    }

    // Register endpoint
    resource function post register(auth:UserRegistration userReg) returns http:Response|error {
        return auth:registerUser(dbClient, userReg);
    }

    // Login endpoint
    resource function post login(auth:UserLogin userLogin) returns http:Response|error {
        return auth:loginUser(dbClient, userLogin);
    }

    // Logout endpoint (with session token)
    resource function post logout(@http:Header string? Authorization) returns http:Response|error {
        string sessionToken = Authorization ?: "";
        if sessionToken.startsWith("Bearer ") {
            sessionToken = sessionToken.substring(7);
        }
        return auth:logoutUser(sessionToken);
    }

    // Get user profile (protected endpoint)
    resource function get profile(@http:Header string? Authorization) returns http:Response|error {
        string sessionToken = Authorization ?: "";
        if sessionToken.startsWith("Bearer ") {
            sessionToken = sessionToken.substring(7);
        }
        return auth:getUserProfile(dbClient, sessionToken);
    }

    // Update user profile (protected endpoint)
    resource function put profile(@http:Header string? Authorization, auth:UserUpdate userUpdate) returns http:Response|error {
        string sessionToken = Authorization ?: "";
        if sessionToken.startsWith("Bearer ") {
            sessionToken = sessionToken.substring(7);
        }
        return auth:updateUserProfile(dbClient, sessionToken, userUpdate);
    }
}

// Initialize database tables on startup
public function main() returns error? {
    check auth:initializeDatabase(dbClient);
    return;
}
