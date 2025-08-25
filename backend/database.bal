// =============================================================================
// DATABASE UTILITIES MODULE
// =============================================================================
// Centralized database connection and utility functions

import ballerina/log;
import ballerina/sql;
import ballerinax/mysql;

// Database configuration constants
public const string DB_HOST = "localhost";
public const int DB_PORT = 3307;
public const string DB_NAME = "insurance_audit";
public const string DB_USER = "root";
public const string DB_PASSWORD = "insurance_password";

// Global database client
public mysql:Client? dbClient = ();

// Initialize database connection
public function initializeDatabase() returns error? {
    log:printInfo("🔌 Attempting database connection...");
    
    mysql:Client|error dbResult = new (
        host = DB_HOST,
        port = DB_PORT,
        database = DB_NAME,
        user = DB_USER,
        password = DB_PASSWORD
    );
    
    if dbResult is mysql:Client {
        dbClient = dbResult;
        log:printInfo("✅ Database connection successful!");
        
        // Test connection and get initial counts
        int|error claimsCount = getTableCount("claims");
        int|error fraudAlertsCount = getTableCount("fraud_alerts");
        
        if claimsCount is int && fraudAlertsCount is int {
            log:printInfo("📊 Table claims has " + claimsCount.toString() + " records");
            log:printInfo("📊 Table fraud_alerts has " + fraudAlertsCount.toString() + " records");
            log:printInfo("🎯 Database contains " + claimsCount.toString() + " claims and " + fraudAlertsCount.toString() + " fraud alerts");
        }
    } else {
        log:printError("❌ Database connection failed: " + dbResult.message());
        return dbResult;
    }
}

// Test database connection
public function testDatabaseConnection() returns boolean {
    mysql:Client? currentClient = dbClient;
    if currentClient is mysql:Client {
        sql:ParameterizedQuery testQuery = `SELECT 1 as test_value`;
        stream<record {}, error?> resultStream = currentClient->query(testQuery);
        error? closeResult = resultStream.close();
        
        if closeResult is () {
            log:printInfo("✅ Database connection test successful");
            return true;
        }
    }
    
    log:printError("❌ Database connection test failed");
    return false;
}

// Get count of records in a table
public function getTableCount(string tableName) returns int|error {
    mysql:Client? currentClient = dbClient;
    if currentClient is mysql:Client {
        sql:ParameterizedQuery countQuery = `SELECT COUNT(*) as count FROM claims`;
        if tableName == "fraud_alerts" {
            countQuery = `SELECT COUNT(*) as count FROM fraud_alerts`;
        }
        
        stream<record {int count;}, error?> resultStream = currentClient->query(countQuery);
        record {|record {int count;} value;|}|error? result = resultStream.next();
        check resultStream.close();
        
        if result is record {|record {int count;} value;|} {
            return result.value.count;
        }
    }
    
    return error("Failed to get table count for: " + tableName);
}

// Get database tables information
public function getDatabaseTablesInfo() returns json|error {
    mysql:Client? currentClient = dbClient;
    if currentClient is mysql:Client {
        // Get claims count
        int|error claimsCount = getTableCount("claims");
        int|error fraudCount = getTableCount("fraud_alerts");
        
        json[] tableInfo = [
            {
                "table_name": "claims",
                "record_count": claimsCount is int ? claimsCount : 0
            },
            {
                "table_name": "fraud_alerts", 
                "record_count": fraudCount is int ? fraudCount : 0
            }
        ];
        
        return {
            "tables": tableInfo,
            "total_tables": 2
        };
    }
    
    return error("Failed to get database tables information");
}

// Get database client (for use in other modules)
public function getDatabaseClient() returns mysql:Client? {
    return dbClient;
}
