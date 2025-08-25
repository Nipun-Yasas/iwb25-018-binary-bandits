// =============================================================================
// FRAUD SERVICE MODULE
// =============================================================================
// Fraud alert endpoints and business logic

import ballerina/log;
import ballerina/sql;
import ballerina/time;
import ballerinax/mysql;

// Get all fraud alerts
public function getAllFraudAlerts(mysql:Client currentClient) returns json|error {
    log:printInfo("🚨 Fetching all fraud alerts from database");
    
    sql:ParameterizedQuery query = `SELECT id, claim_id, message, priority, timestamp, dismissed, created_at 
                                    FROM fraud_alerts ORDER BY created_at DESC`;
    
    stream<record {}, error?> resultStream = currentClient->query(query);
    record {}[]|error alerts = from record {} alert in resultStream select alert;
    check resultStream.close();
    
    if alerts is record {}[] {
        return {
            "message": "✅ Fraud alerts retrieved successfully",
            "total_count": alerts.length(),
            "alerts": alerts.toJson(),
            "retrieved_at": time:utcNow().toString()
        };
    }
    
    return error("Failed to fetch fraud alerts from database");
}

// Get fraud alerts by priority
public function getFraudAlertsByPriority(mysql:Client currentClient, string priority) returns json|error {
    log:printInfo("🚨 Fetching fraud alerts with priority: " + priority);
    
    sql:ParameterizedQuery query = `SELECT id, claim_id, message, priority, timestamp, dismissed, created_at 
                                    FROM fraud_alerts WHERE priority = ${priority} ORDER BY created_at DESC`;
    
    stream<record {}, error?> resultStream = currentClient->query(query);
    record {}[]|error alerts = from record {} alert in resultStream select alert;
    check resultStream.close();
    
    if alerts is record {}[] {
        return {
            "message": "✅ Fraud alerts retrieved by priority: " + priority,
            "priority_filter": priority,
            "total_count": alerts.length(),
            "alerts": alerts.toJson(),
            "retrieved_at": time:utcNow().toString()
        };
    }
    
    return error("Failed to fetch fraud alerts by priority");
}

// Get active (non-dismissed) fraud alerts
public function getActiveFraudAlerts(mysql:Client currentClient) returns json|error {
    log:printInfo("🚨 Fetching active fraud alerts");
    
    sql:ParameterizedQuery query = `SELECT id, claim_id, message, priority, timestamp, dismissed, created_at 
                                    FROM fraud_alerts WHERE dismissed = 0 ORDER BY created_at DESC`;
    
    stream<record {}, error?> resultStream = currentClient->query(query);
    record {}[]|error alerts = from record {} alert in resultStream select alert;
    check resultStream.close();
    
    if alerts is record {}[] {
        return {
            "message": "✅ Active fraud alerts retrieved successfully",
            "total_count": alerts.length(),
            "alerts": alerts.toJson(),
            "retrieved_at": time:utcNow().toString()
        };
    }
    
    return error("Failed to fetch active fraud alerts");
}

// Get a single fraud alert by ID (Updated for string IDs)
public function getFraudAlertById(mysql:Client currentClient, string alertId) returns json|error {
    log:printInfo("🚨 Fetching fraud alert with ID: " + alertId);
    
    sql:ParameterizedQuery query = `SELECT id, claim_id, message, priority, timestamp, dismissed, created_at 
                                    FROM fraud_alerts WHERE id = ${alertId}`;
    
    stream<record {}, error?> resultStream = currentClient->query(query);
    record {}|error? alert = resultStream.next();
    check resultStream.close();
    
    if alert is record {} {
        return {
            "message": "✅ Fraud alert found",
            "alert_id": alertId,
            "alert": alert.toJson(),
            "retrieved_at": time:utcNow().toString()
        };
    } else {
        return error("Fraud alert not found with ID: " + alertId);
    }
}

// Dismiss a fraud alert (Updated for string IDs)
public function dismissFraudAlert(mysql:Client currentClient, string alertId) returns json|error {
    log:printInfo("🚨 Dismissing fraud alert with ID: " + alertId);
    
    sql:ParameterizedQuery updateQuery = `UPDATE fraud_alerts SET dismissed = 1 WHERE id = ${alertId}`;
    
    sql:ExecutionResult|error result = currentClient->execute(updateQuery);
    
    if result is sql:ExecutionResult {
        if result.affectedRowCount > 0 {
            log:printInfo("✅ Fraud alert dismissed successfully");
            
            // Return the updated alert
            json|error updatedAlert = getFraudAlertById(currentClient, alertId);
            if updatedAlert is json {
                return {
                    "message": "Fraud alert dismissed successfully",
                    "alert_id": alertId,
                    "alert": updatedAlert,
                    "dismissed_at": time:utcNow().toString()
                };
            }
        } else {
            return error("Fraud alert not found with ID: " + alertId);
        }
    }
    
    return error("Failed to dismiss fraud alert");
}

// Create a new fraud alert (Updated for string claim IDs)
public function createFraudAlert(mysql:Client currentClient, string claimId, string message, string priority) returns json|error {
    log:printInfo("🚨 Creating new fraud alert for claim: " + claimId);
    
    sql:ParameterizedQuery insertQuery = `INSERT INTO fraud_alerts 
        (claim_id, message, priority, timestamp, dismissed) 
        VALUES (${claimId}, ${message}, ${priority}, NOW(), 0)`;
    
    sql:ExecutionResult|error result = currentClient->execute(insertQuery);
    
    if result is sql:ExecutionResult {
        if result.affectedRowCount > 0 {
            log:printInfo("✅ Fraud alert created successfully");
            
            // Get the most recently created alert for this claim
            sql:ParameterizedQuery getLastQuery = `SELECT id, claim_id, message, priority, timestamp, dismissed, created_at 
                                                   FROM fraud_alerts 
                                                   WHERE claim_id = ${claimId} 
                                                   ORDER BY created_at DESC LIMIT 1`;
            
            stream<record {}, error?> resultStream = currentClient->query(getLastQuery);
            record {}|error? createdAlert = resultStream.next();
            check resultStream.close();
            
            if createdAlert is record {} {
                return {
                    "message": "Fraud alert created successfully",
                    "alert": createdAlert.toJson(),
                    "created_at": time:utcNow().toString()
                };
            }
        }
    }
    
    return error("Failed to create fraud alert");
}

// Get fraud alerts for a specific claim (Updated for string claim IDs)
public function getFraudAlertsByClaimId(mysql:Client currentClient, string claimId) returns json|error {
    log:printInfo("🚨 Fetching fraud alerts for claim ID: " + claimId);
    
    sql:ParameterizedQuery query = `SELECT id, claim_id, message, priority, timestamp, dismissed, created_at 
                                    FROM fraud_alerts WHERE claim_id = ${claimId} ORDER BY created_at DESC`;
    
    stream<record {}, error?> resultStream = currentClient->query(query);
    record {}[]|error alerts = from record {} alert in resultStream select alert;
    check resultStream.close();
    
    if alerts is record {}[] {
        return {
            "message": "✅ Fraud alerts retrieved for claim: " + claimId,
            "claim_id": claimId,
            "total_count": alerts.length(),
            "alerts": alerts.toJson(),
            "retrieved_at": time:utcNow().toString()
        };
    }
    
    return error("Failed to fetch fraud alerts for claim");
}
