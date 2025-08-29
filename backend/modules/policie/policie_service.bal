import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;

// Policy record type
public type Policy record {
    string policy_id;
    int patient_id;
    string insurer_id;
    string start_date; // Date in YYYY-MM-DD format
    string end_date; // Date in YYYY-MM-DD format
    string status;
    decimal coverage_limit;
};

// Policy creation request
public type PolicyCreateRequest record {
    string? policy_id; // Optional - if not provided, will be auto-generated
    int patient_id;
    string insurer_id;
    string start_date;
    string end_date;
    string? status; // Optional - defaults to "Active"
    decimal coverage_limit;
};

// Policy update request
public type PolicyUpdateRequest record {
    string? start_date;
    string? end_date;
    string? status;
    decimal? coverage_limit;
};

// Policy with related information
public type PolicyDetails record {
    string policy_id;
    int patient_id;
    string patient_name;
    string insurer_id;
    string insurer_name;
    string start_date;
    string end_date;
    string status;
    decimal coverage_limit;
    int claims_count;
    decimal total_claimed;
    decimal remaining_coverage;
};

// Create a new policy
public function createPolicy(mysql:Client dbClient, PolicyCreateRequest policyRequest) returns http:Response|error {
    http:Response response = new;
    
    // Validate policy data
    error? validationResult = validatePolicyData(policyRequest);
    if validationResult is error {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": validationResult.message()
        });
        return response;
    }
    
    // Validate foreign keys
    error? foreignKeyValidation = validatePolicyForeignKeys(dbClient, policyRequest.patient_id, policyRequest.insurer_id);
    if foreignKeyValidation is error {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": foreignKeyValidation.message()
        });
        return response;
    }
    
    // Check if policy_id is provided, otherwise auto-generate
    string policyId;
    if policyRequest.policy_id is string {
        policyId = policyRequest.policy_id.toString();
        
        // Check if policy ID already exists
        stream<record{int count;}, error?> countStream = dbClient->query(
            `SELECT COUNT(*) as count FROM policies WHERE policy_id = ${policyId}`
        );
        
        record{int count;}[]|error countResult = from record{int count;} count in countStream select count;
        check countStream.close();
        
        if countResult is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while checking policy ID"
            });
            return response;
        }
        
        if countResult.length() > 0 && countResult[0].count > 0 {
            response.statusCode = 409;
            response.setJsonPayload({
                "success": false,
                "message": string `Policy with ID '${policyId}' already exists`
            });
            return response;
        }
    } else {
        // Auto-generate policy ID
        policyId = generatePolicyId(dbClient);
    }
    
    string status = policyRequest.status ?: "Active";
    
    // Insert policy into database
    sql:ExecutionResult|error result = dbClient->execute(`
        INSERT INTO policies (policy_id, patient_id, insurer_id, start_date, end_date, status, coverage_limit)
        VALUES (${policyId}, ${policyRequest.patient_id}, ${policyRequest.insurer_id}, 
                ${policyRequest.start_date}, ${policyRequest.end_date}, ${status}, ${policyRequest.coverage_limit})
    `);
    
    if result is error {
        if result.message().includes("Duplicate entry") {
            response.statusCode = 409;
            response.setJsonPayload({
                "success": false,
                "message": string `Policy with ID '${policyId}' already exists`
            });
        } else if result.message().includes("foreign key constraint") {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": "Referenced patient or insurer not found"
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while creating policy: " + result.message()
            });
        }
        return response;
    }
    
    if result.affectedRowCount > 0 {
        // Get the created policy
        Policy|error createdPolicy = getPolicyById(dbClient, policyId);
        if createdPolicy is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Policy created but failed to retrieve: " + createdPolicy.message()
            });
            return response;
        }
        
        response.statusCode = 201;
        response.setJsonPayload({
            "success": true,
            "message": "Policy created successfully",
            "policy": createdPolicy.toJson()
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to create policy - no rows affected"
        });
    }
    
    return response;
}

// Get policy by ID
public function getPolicy(mysql:Client dbClient, string policyId) returns http:Response|error {
    http:Response response = new;
    
    Policy|error policy = getPolicyById(dbClient, policyId);
    if policy is error {
        if policy.message().includes("not found") {
            response.statusCode = 404;
            response.setJsonPayload({
                "success": false,
                "message": string `Policy with ID '${policyId}' not found`
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while retrieving policy: " + policy.message()
            });
        }
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "policy": policy.toJson()
    });
    
    return response;
}

// Get policy with detailed information
public function getPolicyDetails(mysql:Client dbClient, string policyId) returns http:Response|error {
    http:Response response = new;
    
    PolicyDetails|error policyDetails = getPolicyDetailsById(dbClient, policyId);
    if policyDetails is error {
        if policyDetails.message().includes("not found") {
            response.statusCode = 404;
            response.setJsonPayload({
                "success": false,
                "message": string `Policy with ID '${policyId}' not found`
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while retrieving policy details: " + policyDetails.message()
            });
        }
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "policyDetails": policyDetails.toJson()
    });
    
    return response;
}

// Get all policies with optional pagination and filtering
public function getAllPolicies(mysql:Client dbClient, string? status = (), int? patientId = (), string? insurerId = (), int? offset = 0, int? 'limit = 50) returns http:Response|error {
    http:Response response = new;
    
    // Validate pagination parameters
    int offsetValue = offset ?: 0;
    int limitValue = 'limit ?: 50;
    
    if offsetValue < 0 {
        offsetValue = 0;
    }
    if limitValue <= 0 || limitValue > 100 {
        limitValue = 50;
    }
    
    // Build query with optional filters
    string whereClause = "WHERE 1=1";
    sql:ParameterizedQuery baseQuery = `SELECT policy_id, patient_id, insurer_id, start_date, end_date, status, coverage_limit FROM policies `;
    sql:ParameterizedQuery countQuery = `SELECT COUNT(*) as total FROM policies `;
    
    if status is string {
        whereClause = whereClause + " AND status = '" + status + "'";
        baseQuery = sql:queryConcat(baseQuery, `WHERE status = ${status}`);
        countQuery = sql:queryConcat(countQuery, `WHERE status = ${status}`);
    }
    
    if patientId is int {
        if status is string {
            baseQuery = sql:queryConcat(baseQuery, ` AND patient_id = ${patientId}`);
            countQuery = sql:queryConcat(countQuery, ` AND patient_id = ${patientId}`);
        } else {
            baseQuery = sql:queryConcat(baseQuery, `WHERE patient_id = ${patientId}`);
            countQuery = sql:queryConcat(countQuery, `WHERE patient_id = ${patientId}`);
        }
    }
    
    if insurerId is string {
        if status is string || patientId is int {
            baseQuery = sql:queryConcat(baseQuery, ` AND insurer_id = ${insurerId}`);
            countQuery = sql:queryConcat(countQuery, ` AND insurer_id = ${insurerId}`);
        } else {
            baseQuery = sql:queryConcat(baseQuery, `WHERE insurer_id = ${insurerId}`);
            countQuery = sql:queryConcat(countQuery, `WHERE insurer_id = ${insurerId}`);
        }
    }
    
    sql:ParameterizedQuery finalQuery = sql:queryConcat(baseQuery, ` ORDER BY policy_id LIMIT ${limitValue} OFFSET ${offsetValue}`);
    
    stream<Policy, error?> policyStream = dbClient->query(finalQuery);
    
    Policy[]|error policies = from Policy policy in policyStream select policy;
    check policyStream.close();
    
    if policies is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while retrieving policies: " + policies.message()
        });
        return response;
    }
    
    // Get total count
    stream<record{int total;}, error?> countStream = dbClient->query(countQuery);
    
    record{int total;}[]|error countResult = from record{int total;} count in countStream select count;
    check countStream.close();
    
    int totalPolicies = 0;
    if countResult is record{int total;}[] && countResult.length() > 0 {
        totalPolicies = countResult[0].total;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "policies": policies.toJson(),
        "filters": {
            "status": status,
            "patientId": patientId,
            "insurerId": insurerId
        },
        "pagination": {
            "offset": offsetValue,
            "limit": limitValue,
            "total": totalPolicies,
            "hasMore": (offsetValue + limitValue) < totalPolicies
        }
    });
    
    return response;
}

// Update policy
public function updatePolicy(mysql:Client dbClient, string policyId, PolicyUpdateRequest updateRequest) returns http:Response|error {
    http:Response response = new;
    
    // Check if policy exists
    Policy|error existingPolicy = getPolicyById(dbClient, policyId);
    if existingPolicy is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Policy with ID '${policyId}' not found`
        });
        return response;
    }
    
    // Build dynamic update query
    sql:ParameterizedQuery updateQuery = `UPDATE policies SET `;
    boolean hasUpdates = false;
    
    if updateRequest.start_date is string {
        // Validate date format
        error? dateValidation = validateDateFormat(updateRequest.start_date.toString());
        if dateValidation is error {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": "Invalid start date format: " + dateValidation.message()
            });
            return response;
        }
        updateQuery = sql:queryConcat(updateQuery, `start_date = ${updateRequest.start_date}`);
        hasUpdates = true;
    }
    
    if updateRequest.end_date is string {
        // Validate date format
        error? dateValidation = validateDateFormat(updateRequest.end_date.toString());
        if dateValidation is error {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": "Invalid end date format: " + dateValidation.message()
            });
            return response;
        }
        
        if hasUpdates {
            updateQuery = sql:queryConcat(updateQuery, `, end_date = ${updateRequest.end_date}`);
        } else {
            updateQuery = sql:queryConcat(updateQuery, `end_date = ${updateRequest.end_date}`);
        }
        hasUpdates = true;
    }
    
    if updateRequest.status is string {
        // Validate status
        if !isValidPolicyStatus(updateRequest.status.toString()) {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": "Invalid policy status. Valid statuses: Active, Inactive, Expired, Cancelled"
            });
            return response;
        }
        
        if hasUpdates {
            updateQuery = sql:queryConcat(updateQuery, `, status = ${updateRequest.status}`);
        } else {
            updateQuery = sql:queryConcat(updateQuery, `status = ${updateRequest.status}`);
        }
        hasUpdates = true;
    }
    
    if updateRequest.coverage_limit is decimal {
        if updateRequest.coverage_limit <= 0d {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": "Coverage limit must be greater than 0"
            });
            return response;
        }
        
        if hasUpdates {
            updateQuery = sql:queryConcat(updateQuery, `, coverage_limit = ${updateRequest.coverage_limit}`);
        } else {
            updateQuery = sql:queryConcat(updateQuery, `coverage_limit = ${updateRequest.coverage_limit}`);
        }
        hasUpdates = true;
    }
    
    if !hasUpdates {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": "No fields to update"
        });
        return response;
    }
    
    updateQuery = sql:queryConcat(updateQuery, ` WHERE policy_id = ${policyId}`);
    
    // Execute update
    sql:ExecutionResult|error result = dbClient->execute(updateQuery);
    
    if result is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while updating policy: " + result.message()
        });
        return response;
    }
    
    if result.affectedRowCount > 0 {
        // Get the updated policy
        Policy|error updatedPolicy = getPolicyById(dbClient, policyId);
        if updatedPolicy is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Policy updated but failed to retrieve: " + updatedPolicy.message()
            });
            return response;
        }
        
        response.statusCode = 200;
        response.setJsonPayload({
            "success": true,
            "message": "Policy updated successfully",
            "policy": updatedPolicy.toJson()
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to update policy - no rows affected"
        });
    }
    
    return response;
}

// Delete policy
public function deletePolicy(mysql:Client dbClient, string policyId) returns http:Response|error {
    http:Response response = new;
    
    // Check if policy exists
    Policy|error existingPolicy = getPolicyById(dbClient, policyId);
    if existingPolicy is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Policy with ID '${policyId}' not found`
        });
        return response;
    }
    
    // Check if policy has associated claims
    stream<record{int claim_count;}, error?> claimCountStream = dbClient->query(
        `SELECT COUNT(*) as claim_count FROM claims WHERE policy_id = ${policyId}`
    );
    
    record{int claim_count;}[]|error claimCountResult = from record{int claim_count;} count in claimCountStream select count;
    check claimCountStream.close();
    
    if claimCountResult is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while checking policy dependencies"
        });
        return response;
    }
    
    if claimCountResult.length() > 0 && claimCountResult[0].claim_count > 0 {
        response.statusCode = 409;
        response.setJsonPayload({
            "success": false,
            "message": string `Cannot delete policy '${policyId}': Policy has ${claimCountResult[0].claim_count} associated claims. Please remove all claims first.`
        });
        return response;
    }
    
    // Delete policy
    sql:ExecutionResult|error result = dbClient->execute(`
        DELETE FROM policies WHERE policy_id = ${policyId}
    `);
    
    if result is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while deleting policy: " + result.message()
        });
        return response;
    }
    
    if result.affectedRowCount > 0 {
        response.statusCode = 200;
        response.setJsonPayload({
            "success": true,
            "message": string `Policy with ID '${policyId}' deleted successfully`
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to delete policy - no rows affected"
        });
    }
    
    return response;
}

// Get policies for a specific patient
public function getPatientPolicies(mysql:Client dbClient, int patientId, int? offset = 0, int? 'limit = 50) returns http:Response|error {
    return getAllPolicies(dbClient, (), patientId, (), offset, 'limit);
}

// Get policies for a specific insurer
public function getInsurerPolicies(mysql:Client dbClient, string insurerId, int? offset = 0, int? 'limit = 50) returns http:Response|error {
    return getAllPolicies(dbClient, (), (), insurerId, offset, 'limit);
}

// Helper functions

// Get policy by ID
function getPolicyById(mysql:Client dbClient, string policyId) returns Policy|error {
    stream<Policy, error?> policyStream = dbClient->query(
        `SELECT policy_id, patient_id, insurer_id, start_date, end_date, status, coverage_limit 
         FROM policies WHERE policy_id = ${policyId}`
    );
    
    Policy[]|error policies = from Policy policy in policyStream select policy;
    check policyStream.close();
    
    if policies is error {
        return error("Database error while retrieving policy");
    }
    
    if policies.length() == 0 {
        return error("Policy not found");
    }
    
    return policies[0];
}

// Get policy details with related information
function getPolicyDetailsById(mysql:Client dbClient, string policyId) returns PolicyDetails|error {
    stream<record{
        string policy_id;
        int patient_id;
        string patient_name;
        string insurer_id;
        string insurer_name;
        string start_date;
        string end_date;
        string status;
        decimal coverage_limit;
    }, error?> detailsStream = dbClient->query(
        `SELECT p.policy_id, p.patient_id, pt.name as patient_name, 
                p.insurer_id, i.name as insurer_name, p.start_date, p.end_date, 
                p.status, p.coverage_limit
         FROM policies p
         JOIN patients pt ON p.patient_id = pt.patient_id
         JOIN insurers i ON p.insurer_id = i.insurer_id
         WHERE p.policy_id = ${policyId}`
    );
    
    record{
        string policy_id;
        int patient_id;
        string patient_name;
        string insurer_id;
        string insurer_name;
        string start_date;
        string end_date;
        string status;
        decimal coverage_limit;
    }[]|error detailsResult = from record{
        string policy_id;
        int patient_id;
        string patient_name;
        string insurer_id;
        string insurer_name;
        string start_date;
        string end_date;
        string status;
        decimal coverage_limit;
    } details in detailsStream select details;
    check detailsStream.close();
    
    if detailsResult is error {
        return error("Database error while retrieving policy details");
    }
    
    if detailsResult.length() == 0 {
        return error("Policy not found");
    }
    
    var policyDetails = detailsResult[0];
    
    // Get claims statistics
    stream<record{int claims_count; decimal total_claimed;}, error?> claimsStream = dbClient->query(
        `SELECT COUNT(*) as claims_count, COALESCE(SUM(claim_amount), 0) as total_claimed
         FROM claims WHERE policy_id = ${policyId}`
    );
    
    record{int claims_count; decimal total_claimed;}[]|error claimsResult = 
        from record{int claims_count; decimal total_claimed;} claims in claimsStream select claims;
    check claimsStream.close();
    
    int claimsCount = 0;
    decimal totalClaimed = 0.0;
    if claimsResult is record{int claims_count; decimal total_claimed;}[] && claimsResult.length() > 0 {
        claimsCount = claimsResult[0].claims_count;
        totalClaimed = claimsResult[0].total_claimed;
    }
    
    PolicyDetails policyDetailsRecord = {
        policy_id: policyDetails.policy_id,
        patient_id: policyDetails.patient_id,
        patient_name: policyDetails.patient_name,
        insurer_id: policyDetails.insurer_id,
        insurer_name: policyDetails.insurer_name,
        start_date: policyDetails.start_date,
        end_date: policyDetails.end_date,
        status: policyDetails.status,
        coverage_limit: policyDetails.coverage_limit,
        claims_count: claimsCount,
        total_claimed: totalClaimed,
        remaining_coverage: policyDetails.coverage_limit - totalClaimed
    };
    
    return policyDetailsRecord;
}

// Generate a unique policy ID
function generatePolicyId(mysql:Client dbClient) returns string {
    // Get the highest existing ID number
    stream<record{string max_id;}, error?> maxIdStream = dbClient->query(
        `SELECT MAX(CAST(SUBSTRING(policy_id, 7) AS UNSIGNED)) as max_id 
         FROM policies WHERE policy_id LIKE 'POLICY%'`
    );
    
    record{string max_id;}[]|error maxIdResult = from record{string max_id;} maxId in maxIdStream select maxId;
    
    int nextNumber = 1;
    if maxIdResult is record{string max_id;}[] && maxIdResult.length() > 0 {
        string? maxIdStr = maxIdResult[0].max_id;
        if maxIdStr is string {
            int|error maxIdNum = int:fromString(maxIdStr);
            if maxIdNum is int {
                nextNumber = maxIdNum + 1;
            }
        }
    }
    
    // Format as POLICY001, POLICY002, etc.
    return string `POLICY${nextNumber.toString().padZero(3)}`;
}

// Validation functions
function validatePolicyData(PolicyCreateRequest policyRequest) returns error? {
    // Validate patient ID
    if policyRequest.patient_id <= 0 {
        return error("Patient ID must be a positive number");
    }
    
    // Validate insurer ID
    if policyRequest.insurer_id.trim() == "" {
        return error("Insurer ID is required");
    }
    
    // Validate dates
    error? startDateValidation = validateDateFormat(policyRequest.start_date);
    if startDateValidation is error {
        return error("Invalid start date format: " + startDateValidation.message());
    }
    
    error? endDateValidation = validateDateFormat(policyRequest.end_date);
    if endDateValidation is error {
        return error("Invalid end date format: " + endDateValidation.message());
    }
    
    // Validate date range
    if policyRequest.start_date >= policyRequest.end_date {
        return error("End date must be after start date");
    }
    
    // Validate coverage limit
    if policyRequest.coverage_limit <= 0d {
        return error("Coverage limit must be greater than 0");
    }
    
    // Validate status if provided
    if policyRequest.status is string && !isValidPolicyStatus(policyRequest.status.toString()) {
        return error("Invalid policy status. Valid statuses: Active, Inactive, Expired, Cancelled");
    }
    
    return;
}

function validatePolicyForeignKeys(mysql:Client dbClient, int patientId, string insurerId) returns error? {
    // Check if patient exists
    stream<record{int count;}, error?> patientStream = dbClient->query(
        `SELECT COUNT(*) as count FROM patients WHERE patient_id = ${patientId}`
    );
    
    record{int count;}[]|error patientResult = from record{int count;} count in patientStream select count;
    check patientStream.close();
    
    if patientResult is error {
        return error("Database error while validating patient ID");
    }
    
    if patientResult.length() == 0 || patientResult[0].count == 0 {
        return error(string `Patient with ID '${patientId}' does not exist`);
    }
    
    // Check if insurer exists
    stream<record{int count;}, error?> insurerStream = dbClient->query(
        `SELECT COUNT(*) as count FROM insurers WHERE insurer_id = ${insurerId}`
    );
    
    record{int count;}[]|error insurerResult = from record{int count;} count in insurerStream select count;
    check insurerStream.close();
    
    if insurerResult is error {
        return error("Database error while validating insurer ID");
    }
    
    if insurerResult.length() == 0 || insurerResult[0].count == 0 {
        return error(string `Insurer with ID '${insurerId}' does not exist`);
    }
    
    return;
}

function validateDateFormat(string dateStr) returns error? {
    // Check if date is in YYYY-MM-DD format
    if dateStr.length() != 10 {
        return error("Date must be in YYYY-MM-DD format");
    }
    
    string[] parts = re`-`.split(dateStr);
    if parts.length() != 3 {
        return error("Date must be in YYYY-MM-DD format");
    }
    
    // Validate year, month, day
    int|error year = int:fromString(parts[0]);
    int|error month = int:fromString(parts[1]);
    int|error day = int:fromString(parts[2]);
    
    if year is error || month is error || day is error {
        return error("Invalid date format");
    }
    
    if year < 1900 || year > 2100 {
        return error("Year must be between 1900 and 2100");
    }
    
    if month < 1 || month > 12 {
        return error("Month must be between 1 and 12");
    }
    
    if day < 1 || day > 31 {
        return error("Day must be between 1 and 31");
    }
    
    return;
}

function isValidPolicyStatus(string status) returns boolean {
    return status == "Active" || 
           status == "Inactive" || 
           status == "Expired" || 
           status == "Cancelled";
}