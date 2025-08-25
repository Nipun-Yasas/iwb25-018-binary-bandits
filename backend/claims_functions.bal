// ==========================================================================
// CLAIMS FUNCTIONS MODULE - Claims Management Business Logic
// ==========================================================================

import ballerina/log;
import ballerina/sql;
import ballerina/time;
import ballerinax/mysql;

// Get all claims from database
public function getAllClaims(mysql:Client dbClient) returns json|error {
    log:printInfo("📋 Fetching all claims from database");
    
    sql:ParameterizedQuery query = `SELECT id, submission_date, amount, risk_level, status, 
                                           claim_type, reviewer, submitter_id, description, 
                                           incident_date, location, created_at, updated_at 
                                    FROM claims ORDER BY created_at DESC`;
    
    stream<record {}, error?> resultStream = dbClient->query(query);
    record {}[]|error claims = from record {} claim in resultStream select claim;
    check resultStream.close();
    
    if claims is record {}[] {
        return {
            "message": "✅ Claims retrieved successfully",
            "total_count": claims.length(),
            "claims": claims.toJson(),
            "retrieved_at": time:utcNow().toString()
        };
    }
    
    return error("Failed to fetch claims from database");
}

// Get claims filtered by status
public function getClaimsByStatus(mysql:Client dbClient, string status) returns json|error {
    log:printInfo("📋 Fetching claims with status: " + status);
    
    sql:ParameterizedQuery query = `SELECT id, submission_date, amount, risk_level, status, 
                                           claim_type, reviewer, submitter_id, description, 
                                           incident_date, location, created_at, updated_at 
                                    FROM claims WHERE status = ${status} ORDER BY created_at DESC`;
    
    stream<record {}, error?> resultStream = dbClient->query(query);
    record {}[]|error claims = from record {} claim in resultStream select claim;
    check resultStream.close();
    
    if claims is record {}[] {
        return {
            "message": "✅ Claims retrieved by status: " + status,
            "status_filter": status,
            "total_count": claims.length(),
            "claims": claims.toJson(),
            "retrieved_at": time:utcNow().toString()
        };
    }
    
    return error("Failed to fetch claims by status");
}

// Get a single claim by ID (Updated for string IDs)
public function getClaimById(mysql:Client dbClient, string claimId) returns json|error {
    log:printInfo("📋 Fetching claim with ID: " + claimId);
    
    sql:ParameterizedQuery query = `SELECT id, submission_date, amount, risk_level, status, 
                                           claim_type, reviewer, submitter_id, description, 
                                           incident_date, location, created_at, updated_at 
                                    FROM claims WHERE id = ${claimId}`;
    
    stream<record {}, error?> resultStream = dbClient->query(query);
    record {}|error? claim = resultStream.next();
    check resultStream.close();
    
    if claim is record {} {
        return {
            "message": "✅ Claim found",
            "claim_id": claimId,
            "claim": claim.toJson(),
            "retrieved_at": time:utcNow().toString()
        };
    } else {
        return error("Claim not found with ID: " + claimId);
    }
}

// Update claim status (Updated for string IDs)
public function updateClaimStatus(mysql:Client dbClient, string claimId, string newStatus) returns json|error {
    log:printInfo("📝 Updating claim " + claimId + " status to: " + newStatus);
    
    sql:ParameterizedQuery updateQuery = `UPDATE claims SET status = ${newStatus}, updated_at = NOW() WHERE id = ${claimId}`;
    
    sql:ExecutionResult|error result = dbClient->execute(updateQuery);
    
    if result is sql:ExecutionResult {
        if result.affectedRowCount > 0 {
            log:printInfo("✅ Claim status updated successfully");
            
            // Return the updated claim
            json|error updatedClaim = getClaimById(dbClient, claimId);
            if updatedClaim is json {
                return {
                    "message": "Claim status updated successfully",
                    "claim_id": claimId,
                    "new_status": newStatus,
                    "claim": updatedClaim,
                    "updated_at": time:utcNow().toString()
                };
            }
        } else {
            return error("Claim not found with ID: " + claimId);
        }
    }
    
    return error("Failed to update claim status");
}
