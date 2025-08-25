// =============================================================================
// MAIN SERVICE - MODULAR INSURANCE CLAIM AUDIT DASHBOARD API  
// =============================================================================
// Clean main service that orchestrates modular endpoint services

import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerinax/mysql;


// =============================================================================
// MAIN APPLICATION INITIALIZATION
// =============================================================================

public function main() returns error? {
    log:printInfo("🚀 Insurance Claim Audit Dashboard API Starting...");
    log:printInfo("🔧 CORS will be handled in individual endpoints");
    
    // Initialize database connection
    error? dbInitResult = initializeDatabase();
    if dbInitResult is error {
        log:printError("❌ Failed to initialize database: " + dbInitResult.message());
        return dbInitResult;
    }
    
    log:printInfo("🌐 Server running on http://localhost:8080/api");
    log:printInfo("📋 Available endpoints:");
    log:printInfo("   GET /api/test        - Basic test endpoint");
    log:printInfo("   GET /api/health      - Health check endpoint");
    log:printInfo("   GET /api/status      - Service status with timestamp");
    log:printInfo("   GET /api/dbtest      - Database connection test");
    log:printInfo("   GET /api/dbinfo      - Database configuration info");
    log:printInfo("   GET /api/dashboard/stats - Dashboard statistics");
    log:printInfo("   GET /api/claims      - All claims");
    log:printInfo("   GET /api/claims/{id} - Single claim");
    log:printInfo("   GET /api/claims/status/{status} - Claims by status");
    log:printInfo("   PUT /api/claims/{id}/status - Update claim status");
    log:printInfo("   GET /api/fraud       - All fraud alerts");
    log:printInfo("   GET /api/fraud/active - Active fraud alerts");
    log:printInfo("   PUT /api/fraud/{id}/dismiss - Dismiss fraud alert");
    log:printInfo("   GET /api/tables      - Live database table information");
}

// =============================================================================
// HTTP SERVICE CONFIGURATION
// =============================================================================

// HTTP listener on port 8080
listener http:Listener httpListener = new(8080);

service /api on httpListener {
    
    // ==========================================================================
    // BASIC STATUS ENDPOINTS
    // ==========================================================================
    
    // 🧪 Basic Test Endpoint
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: false,
            allowHeaders: ["Content-Type"],
            allowMethods: ["GET"]
        }
    }
    resource function get test() returns json {
        log:printInfo("🧪 Test endpoint called");
        return {
            "message": "✅ Insurance Claim Audit Dashboard API is working!",
            "timestamp": time:utcNow().toString(),
            "version": "1.0.0",
            "status": "healthy"
        };
    }
    
    // ❤️ Health Check Endpoint
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: false,
            allowHeaders: ["Content-Type"],
            allowMethods: ["GET"]
        }
    }
    resource function get health() returns json {
        log:printInfo("❤️ Health check requested");
        
        boolean dbHealthy = testDatabaseConnection();
        
        return {
            "status": dbHealthy ? "healthy" : "unhealthy",
            "timestamp": time:utcNow().toString(),
            "services": {
                "api": "operational",
                "database": dbHealthy ? "connected" : "disconnected"
            }
        };
    }
    
    // 📊 Service Status Endpoint
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: false,
            allowHeaders: ["Content-Type"],
            allowMethods: ["GET"]
        }
    }
    resource function get status() returns json {
        log:printInfo("📊 Service status requested");
        return {
            "message": "✅ Service is running",
            "timestamp": time:utcNow().toString(),
            "uptime": "Service started",
            "environment": "development"
        };
    }
    
    // 🔌 Database Connection Test Endpoint
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: false,
            allowHeaders: ["Content-Type"],
            allowMethods: ["GET"]
        }
    }
    resource function get dbtest() returns json {
        log:printInfo("🔌 Database connection test requested");
        
        boolean isConnected = testDatabaseConnection();
        
        if isConnected {
            return {
                "message": "✅ Database connection successful",
                "database": DB_NAME,
                "host": DB_HOST + ":" + DB_PORT.toString(),
                "status": "connected",
                "tested_at": time:utcNow().toString()
            };
        } else {
            return {
                "message": "❌ Database connection failed",
                "database": DB_NAME,
                "host": DB_HOST + ":" + DB_PORT.toString(),
                "status": "disconnected",
                "tested_at": time:utcNow().toString()
            };
        }
    }
    
    // 🔧 Database Configuration Info Endpoint
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: false,
            allowHeaders: ["Content-Type"],
            allowMethods: ["GET"]
        }
    }
    resource function get dbinfo() returns json {
        log:printInfo("🔧 Database configuration info requested");
        
        return {
            "message": "✅ Database configuration information",
            "database": DB_NAME,
            "host": DB_HOST,
            "port": DB_PORT,
            "user": DB_USER,
            "connection_status": testDatabaseConnection() ? "connected" : "disconnected",
            "retrieved_at": time:utcNow().toString()
        };
    }
    
    // ==========================================================================
    // DASHBOARD STATISTICS ENDPOINTS
    // ==========================================================================
    
    // 📊 Dashboard Statistics Endpoint
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: true,
            allowHeaders: ["Authorization", "Content-Type"],
            allowMethods: ["GET", "OPTIONS"]
        }
    }
    resource function get dashboard/stats() returns json|error {
        log:printInfo("📊 Dashboard Statistics endpoint called");
        
        mysql:Client? currentClient = getDatabaseClient();
        if currentClient is mysql:Client {
            json|error result = getDashboardStatistics(currentClient);
            
            if result is json {
                log:printInfo("✅ Dashboard statistics generated successfully");
                return result;
            } else {
                log:printError("❌ Error generating dashboard statistics: " + result.message());
                return error("Failed to generate dashboard statistics: " + result.message());
            }
        }
        
        return error("Database client not initialized");
    }
    
    // ==========================================================================
    // CLAIMS MANAGEMENT ENDPOINTS
    // ==========================================================================
    
    // GET /api/claims - Get all claims
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: true,
            allowHeaders: ["Authorization", "Content-Type"],
            allowMethods: ["GET", "OPTIONS"]
        }
    }
    resource function get claims() returns json|error {
        log:printInfo("📋 Claims list endpoint called");
        
        mysql:Client? currentClient = getDatabaseClient();
        if currentClient is mysql:Client {
            json|error result = getAllClaims(currentClient);
            
            if result is json {
                log:printInfo("✅ Claims retrieved successfully");
                return result;
            } else {
                log:printError("❌ Error fetching claims: " + result.message());
                return error("Failed to fetch claims: " + result.message());
            }
        }
        
        return error("Database client not initialized");
    }
    
    // GET /api/claims/{id} - Get specific claim (Fix: change int to string)
@http:ResourceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: true,
        allowHeaders: ["Authorization", "Content-Type"],
        allowMethods: ["GET", "OPTIONS"]
    }
}
resource function get claims/[string claimId]() returns json|error {
    log:printInfo("📋 Single claim endpoint called for ID: " + claimId);
    
    mysql:Client? currentClient = getDatabaseClient();
    if currentClient is mysql:Client {
        json|error result = getClaimById(currentClient, claimId);
        
        if result is json {
            log:printInfo("✅ Claim retrieved successfully");
            return result;
        } else {
            log:printError("❌ Error fetching claim: " + result.message());
            return error("Failed to fetch claim: " + result.message());
        }
    }
    
    return error("Database client not initialized");
}
    
    // GET /api/claims/status/{status} - Get claims by status
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: true,
            allowHeaders: ["Authorization", "Content-Type"],
            allowMethods: ["GET", "OPTIONS"]
        }
    }
    resource function get claims/status/[string status]() returns json|error {
        log:printInfo("📋 Claims by status endpoint called for: " + status);
        
        mysql:Client? currentClient = getDatabaseClient();
        if currentClient is mysql:Client {
            json|error result = getClaimsByStatus(currentClient, status);
            
            if result is json {
                log:printInfo("✅ Claims by status retrieved successfully");
                return result;
            } else {
                log:printError("❌ Error fetching claims by status: " + result.message());
                return error("Failed to fetch claims by status: " + result.message());
            }
        }
        
        return error("Database client not initialized");
    }
    
// PUT /api/claims/{id}/status - Update claim status (Fix: change int to string)
@http:ResourceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: true,
        allowHeaders: ["Authorization", "Content-Type"],
        allowMethods: ["PUT", "OPTIONS"]
    }
}
resource function put claims/[string claimId]/status(@http:Payload json payload) returns json|error {
    log:printInfo("📝 Update claim status endpoint called for ID: " + claimId);
    
    mysql:Client? currentClient = getDatabaseClient();
    if currentClient is mysql:Client {
        // Extract status from payload
        json|error statusField = payload.status;
        if statusField is string {
            json|error result = updateClaimStatus(currentClient, claimId, statusField);
            
            if result is json {
                log:printInfo("✅ Claim status updated successfully");
                return result;
            } else {
                log:printError("❌ Error updating claim status: " + result.message());
                return error("Failed to update claim status: " + result.message());
            }
        } else {
            return error("Invalid status provided in request payload");
        }
    }
    
    return error("Database client not initialized");
}
    
    // ==========================================================================
    // FRAUD ALERT ENDPOINTS
    // ==========================================================================
    
    // GET /api/fraud - Get all fraud alerts
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: true,
            allowHeaders: ["Authorization", "Content-Type"],
            allowMethods: ["GET", "OPTIONS"]
        }
    }
    resource function get fraud() returns json|error {
        log:printInfo("🚨 Fraud alerts list endpoint called");
        
        mysql:Client? currentClient = getDatabaseClient();
        if currentClient is mysql:Client {
            json|error result = getAllFraudAlerts(currentClient);
            
            if result is json {
                log:printInfo("✅ Fraud alerts retrieved successfully");
                return result;
            } else {
                log:printError("❌ Error fetching fraud alerts: " + result.message());
                return error("Failed to fetch fraud alerts: " + result.message());
            }
        }
        
        return error("Database client not initialized");
    }
    
    // GET /api/fraud/active - Get active fraud alerts
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: true,
            allowHeaders: ["Authorization", "Content-Type"],
            allowMethods: ["GET", "OPTIONS"]
        }
    }
    resource function get fraud/active() returns json|error {
        log:printInfo("🚨 Active fraud alerts endpoint called");
        
        mysql:Client? currentClient = getDatabaseClient();
        if currentClient is mysql:Client {
            json|error result = getActiveFraudAlerts(currentClient);
            
            if result is json {
                log:printInfo("✅ Active fraud alerts retrieved successfully");
                return result;
            } else {
                log:printError("❌ Error fetching active fraud alerts: " + result.message());
                return error("Failed to fetch active fraud alerts: " + result.message());
            }
        }
        
        return error("Database client not initialized");
    }
    
    // PUT /api/fraud/{id}/dismiss - Dismiss fraud alert
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: true,
            allowHeaders: ["Authorization", "Content-Type"],
            allowMethods: ["PUT", "OPTIONS"]
        }
    }
    resource function put fraud/[string alertId]/dismiss() returns json|error {
        log:printInfo("🚨 Dismiss fraud alert endpoint called for ID: " + alertId);
        
        mysql:Client? currentClient = getDatabaseClient();
        if currentClient is mysql:Client {
            json|error result = dismissFraudAlert(currentClient, alertId);
            
            if result is json {
                log:printInfo("✅ Fraud alert dismissed successfully");
                return result;
            } else {
                log:printError("❌ Error dismissing fraud alert: " + result.message());
                return error("Failed to dismiss fraud alert: " + result.message());
            }
        }
        
        return error("Database client not initialized");
    }
    
    // ==========================================================================
    // DATABASE INFORMATION ENDPOINTS
    // ==========================================================================
    
    // GET /api/tables - Database tables information
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["http://localhost:3000"],
            allowCredentials: false,
            allowHeaders: ["Content-Type"],
            allowMethods: ["GET"]
        }
    }
    resource function get tables() returns json {
        log:printInfo("🔍 Live database tables info requested");
        
        // Get real database table information
        json|error tablesInfo = getDatabaseTablesInfo();
        
        if tablesInfo is json {
            return {
                "message": "✅ Live database table information",
                "database": DB_NAME,
                "host": DB_HOST + ":" + DB_PORT.toString(),
                "data": tablesInfo,
                "retrieved_at": time:utcNow().toString(),
                "note": "This data is retrieved in real-time from the database"
            };
        } else {
            return {
                "message": "❌ Failed to retrieve database table information",
                "error": tablesInfo.message(),
                "retrieved_at": time:utcNow().toString()
            };
        }
    }
}
