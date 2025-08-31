import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;
import ballerina/uuid;


public type Claim record {
    string resourceType;
    string id;
    Reference patient;
    Reference insurer;
    Reference provider;
    Insurance[] insurance;
    Diagnosis[] diagnosis;
    Item[] item;
    Money total;
};

public type Reference record {
    string reference;
};

public type Insurance record {
    int sequence;
    boolean focal;
    Reference coverage;
};

public type Diagnosis record {
    int sequence;
    CodeableConcept diagnosisCodeableConcept;
};

public type CodeableConcept record {
    Coding[] coding;
};

public type Coding record {
    string code;
    string display;
};

public type Item record {
    int sequence;
    CodeableConcept productOrService;
    Money unitPrice;
};

public type Money record {
    decimal value;
    string currency;
};

// ClaimResponse types
public type ClaimResponse record {
    string resourceType;
    string id;
    Reference request;
    string outcome;
    string status;
    Reference patient;
    Reference insurer;
    string disposition;
    Payment payment;
};

public type Payment record {
    Money amount;
};

// Database claim record
public type ClaimRecord record {
    string claim_id;
    string patient_id;  // Changed from int to string
    string policy_id;
    string provider_id;
    string? diagnosis_code;
    string? procedure_code;
    decimal claim_amount;
    string status;
    string? decision_reason;
};

// Claim submission request
public type ClaimSubmission record {
    Claim claim;
    string? sessionToken;
};

public function handleClaimRequest(http:Request req) returns http:Response|error {
    http:Response response = new;
    
    // Get request body
    json|error payload = req.getJsonPayload();
    if payload is error {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": "Invalid JSON payload"
        });
        return response;
    }
    
    // Parse claim from JSON
    Claim|error claim = payload.cloneWithType(Claim);
    if claim is error {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": "Invalid claim format"
        });
        return response;
    }
    
    // Process the claim (this would typically involve database operations)
    ClaimResponse|error claimResponse = processClaim(claim);
    if claimResponse is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to process claim"
        });
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload(claimResponse.toJson());
    return response;
}

// Submit a new claim
public function submitClaim(mysql:Client dbClient, Claim claim) returns http:Response|error {
    http:Response response = new;
    
    // Validate claim
    error? validationResult = validateClaim(claim);
    if validationResult is error {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": validationResult.message()
        });
        return response;
    }
    
    // Extract claim data
    string patientRef = claim.patient.reference;
    string patientId = extractStringIdFromReference(patientRef);
    
    string claimId = claim.id;
    decimal totalAmount = claim.total.value;
    string diagnosisCode = claim.diagnosis.length() > 0 ? claim.diagnosis[0].diagnosisCodeableConcept.coding[0].code : "";
    string procedureCode = claim.item.length() > 0 ? claim.item[0].productOrService.coding[0].code : "";
    string providerRef = claim.provider.reference;
    string providerId = extractStringIdFromReference(providerRef);
    
    // Get policy information from insurance
    string policyId = "";
    if claim.insurance.length() > 0 {
        string coverageRef = claim.insurance[0].coverage.reference;
        policyId = extractStringIdFromReference(coverageRef);
    }
    
    // Validate entities exist in database
    error? entityValidation = validateEntitiesExist(dbClient, patientId, providerId, policyId);
    if entityValidation is error {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": entityValidation.message()
        });
        return response;
    }
    
    // Fraud detection - check for duplicate/suspicious claims
    string? fraudReason = check detectFraud(dbClient, patientId, providerId, diagnosisCode, procedureCode, totalAmount);
    
    string status = "Submitted";
    string decisionReason = "Pending review";
    
    if fraudReason is string {
        status = "Rejected";
        decisionReason = fraudReason;
    }
    
    // Insert claim into database
    sql:ExecutionResult result = check dbClient->execute(`
        INSERT INTO claims (claim_id, patient_id, policy_id, provider_id, diagnosis_code, procedure_code, claim_amount, status, decision_reason)
        VALUES (${claimId}, ${patientId}, ${policyId}, ${providerId}, ${diagnosisCode}, ${procedureCode}, ${totalAmount}, ${status}, ${decisionReason})
    `);
    
    if result.affectedRowCount > 0 {
        if status == "Rejected" {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": "Claim rejected due to fraud detection",
                "reason": fraudReason,
                "claimId": claimId
            });
        } else {
            // Process the claim automatically for non-fraudulent claims
            ClaimResponse claimResponse = check processClaimById(dbClient, claimId);
            
            response.statusCode = 201;
            response.setJsonPayload({
                "success": true,
                "message": "Claim submitted and processed successfully",
                "claimResponse": claimResponse.toJson()
            });
        }
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to submit claim"
        });
    }
    
    return response;
}

// Validate that patient, provider, and policy exist in database
function validateEntitiesExist(mysql:Client dbClient, string patientId, string providerId, string policyId) returns error? {
    // Check if patient exists
    stream<record{int count;}, error?> patientStream = dbClient->query(
        `SELECT COUNT(*) as count FROM patients WHERE patient_id = ${patientId}`
    );
    
    record{int count;}[]|error patientResult = from record{int count;} count in patientStream select count;
    check patientStream.close();
    
    if patientResult is error || patientResult.length() == 0 || patientResult[0].count == 0 {
        return error("Patient with ID " + patientId + " does not exist in the system");
    }
    
    // Check if provider exists
    stream<record{int count;}, error?> providerStream = dbClient->query(
        `SELECT COUNT(*) as count FROM providers WHERE provider_id = ${providerId}`
    );
    
    record{int count;}[]|error providerResult = from record{int count;} count in providerStream select count;
    check providerStream.close();
    
    if providerResult is error || providerResult.length() == 0 || providerResult[0].count == 0 {
        return error("Provider with ID " + providerId + " does not exist in the system");
    }
    
    // Check if policy exists and is active
    stream<record{int count; string status;}, error?> policyStream = dbClient->query(
        `SELECT COUNT(*) as count, status FROM policies WHERE policy_id = ${policyId} GROUP BY status`
    );
    
    record{int count; string status;}[]|error policyResult = from record{int count; string status;} policy in policyStream select policy;
    check policyStream.close();
    
    if policyResult is error || policyResult.length() == 0 || policyResult[0].count == 0 {
        return error("Policy with ID " + policyId + " does not exist in the system");
    }
    
    if policyResult[0].status != "Active" {
        return error("Policy with ID " + policyId + " is not active (Status: " + policyResult[0].status + ")");
    }
    
    return;
}

// Fraud detection function
function detectFraud(mysql:Client dbClient, string patientId, string providerId, string diagnosisCode, string procedureCode, decimal amount) returns string?|error {
    
    // Check for duplicate claims within last 30 days
    stream<record{int count;}, error?> duplicateStream = dbClient->query(
        `SELECT COUNT(*) as count FROM claims 
         WHERE patient_id = ${patientId} 
         AND provider_id = ${providerId} 
         AND diagnosis_code = ${diagnosisCode} 
         AND procedure_code = ${procedureCode}
         AND claim_amount = ${amount}
         AND DATE(NOW()) - INTERVAL 30 DAY <= DATE(NOW())`
    );
    
    record{int count;}[]|error duplicateResult = from record{int count;} count in duplicateStream select count;
    check duplicateStream.close();
    
    if duplicateResult is record{int count;}[] && duplicateResult.length() > 0 && duplicateResult[0].count >= 2 {
        return "Fraud detected: Duplicate claim - Patient has submitted identical claims more than twice in the last 30 days";
    }
    
    // Check for excessive claims frequency (more than 5 claims in 7 days)
    stream<record{int count;}, error?> frequencyStream = dbClient->query(
        `SELECT COUNT(*) as count FROM claims 
         WHERE patient_id = ${patientId} 
         AND DATE(NOW()) - INTERVAL 7 DAY <= DATE(NOW())`
    );
    
    record{int count;}[]|error frequencyResult = from record{int count;} count in frequencyStream select count;
    check frequencyStream.close();
    
    if frequencyResult is record{int count;}[] && frequencyResult.length() > 0 && frequencyResult[0].count >= 5 {
        return "Fraud detected: Excessive claim frequency - Patient has submitted more than 5 claims in the last 7 days";
    }
    
    // Check for unusually high amount claims (over $10,000)
    if amount > 10000d {
        return "Fraud detected: Unusually high claim amount exceeding $10,000 requires manual review";
    }
    
    // Check for same day claims with different providers
    stream<record{int count;}, error?> sameDayStream = dbClient->query(
        `SELECT COUNT(DISTINCT provider_id) as count FROM claims 
         WHERE patient_id = ${patientId} 
         AND DATE(NOW()) = CURDATE()`
    );
    
    record{int count;}[]|error sameDayResult = from record{int count;} count in sameDayStream select count;
    check sameDayStream.close();
    
    if sameDayResult is record{int count;}[] && sameDayResult.length() > 0 && sameDayResult[0].count >= 3 {
        return "Fraud detected: Multiple claims with different providers on the same day";
    }
    
    return ();
}

// Process claim by ID from database
function processClaimById(mysql:Client dbClient, string claimId) returns ClaimResponse|error {
    // Get claim from database
    stream<ClaimRecord, error?> claimStream = dbClient->query(
        `SELECT claim_id, patient_id, policy_id, provider_id, diagnosis_code, procedure_code, claim_amount, status, decision_reason 
         FROM claims WHERE claim_id = ${claimId}`
    );
    
    ClaimRecord[]|error claims = from ClaimRecord claim in claimStream select claim;
    check claimStream.close();
    
    if claims is error || claims.length() == 0 {
        return error("Claim not found");
    }
    
    ClaimRecord claim = claims[0];
    
    // Don't process if already rejected
    if claim.status == "Rejected" {
        string responseId = "resp_" + claimId;
        
        ClaimResponse claimResponse = {
            resourceType: "ClaimResponse",
            id: responseId,
            request: { reference: "Claim/" + claimId },
            outcome: "error",
            status: "cancelled",
            patient: { reference: "Patient/" + claim.patient_id },
            insurer: { reference: "Organization/INS001" },
            disposition: claim.decision_reason ?: "Claim rejected",
            payment: {
                amount: {
                    value: 0d,
                    currency: "USD"
                }
            }
        };
        
        return claimResponse;
    }
    
    // Determine approval status based on business rules
    string disposition = "Approved - Covered under policy";
    string outcome = "complete";
    string status = "active";
    decimal paymentAmount = claim.claim_amount;
    
    // Business logic for claim approval
    if claim.claim_amount > 5000d {
        disposition = "Partially Approved - Amount exceeds limit";
        paymentAmount = 5000d; // Cap at policy limit
    }
    
    // Update claim status in database
    _ = check dbClient->execute(`
        UPDATE claims SET status = 'Processed', decision_reason = ${disposition} 
        WHERE claim_id = ${claimId}
    `);
    
    // Generate response ID
    string responseId = "resp_" + claimId;
    
    ClaimResponse claimResponse = {
        resourceType: "ClaimResponse",
        id: responseId,
        request: { reference: "Claim/" + claimId },
        outcome: outcome,
        status: status,
        patient: { reference: "Patient/" + claim.patient_id },
        insurer: { reference: "Organization/INS001" }, // Default insurer
        disposition: disposition,
        payment: {
            amount: {
                value: paymentAmount,
                currency: "USD"
            }
        }
    };
    
    return claimResponse;
}

// Get claim status
public function getClaimStatus(mysql:Client dbClient, string claimId) returns http:Response|error {
    http:Response response = new;
    
    stream<ClaimRecord, error?> claimStream = dbClient->query(
        `SELECT claim_id, patient_id, policy_id, provider_id, diagnosis_code, procedure_code, claim_amount, status, decision_reason 
         FROM claims WHERE claim_id = ${claimId}`
    );
    
    ClaimRecord[]|error claims = from ClaimRecord claim in claimStream select claim;
    check claimStream.close();
    
    if claims is error || claims.length() == 0 {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": "Claim not found"
        });
        return response;
    }
    
    ClaimRecord claim = claims[0];
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "claim": {
            "claimId": claim.claim_id,
            "patientId": claim.patient_id,
            "amount": claim.claim_amount,
            "status": claim.status,
            "decisionReason": claim.decision_reason
        }
    });
    
    return response;
}

// Get all claims with pagination and filtering
public function getAllClaims(mysql:Client dbClient, string? status = (), int? patientId = (), string? providerId = (), int? offset = 0, int? 'limit = 50) returns http:Response|error {
    http:Response response = new;
    
    // Build parameterized query based on filters
    sql:ParameterizedQuery baseQuery = `SELECT claim_id, patient_id, policy_id, provider_id, diagnosis_code, procedure_code, claim_amount, status, decision_reason FROM claims`;
    sql:ParameterizedQuery whereClause = ``;
    sql:ParameterizedQuery countBaseQuery = `SELECT COUNT(*) as total FROM claims`;
    
    // Build WHERE clause based on filters
    boolean hasConditions = false;
    
    if status is string && status.trim() != "" {
        if hasConditions {
            whereClause = sql:queryConcat(whereClause, ` AND status = ${status}`);
        } else {
            whereClause = sql:queryConcat(whereClause, ` WHERE status = ${status}`);
            hasConditions = true;
        }
    }
    
    if patientId is int {
        if hasConditions {
            whereClause = sql:queryConcat(whereClause, ` AND patient_id = ${patientId}`);
        } else {
            whereClause = sql:queryConcat(whereClause, ` WHERE patient_id = ${patientId}`);
            hasConditions = true;
        }
    }
    
    if providerId is string && providerId.trim() != "" {
        if hasConditions {
            whereClause = sql:queryConcat(whereClause, ` AND provider_id = ${providerId}`);
        } else {
            whereClause = sql:queryConcat(whereClause, ` WHERE provider_id = ${providerId}`);
            hasConditions = true;
        }
    }
    
    int offsetValue = offset ?: 0;
    int limitValue = 'limit ?: 50;
    
    sql:ParameterizedQuery fullQuery = sql:queryConcat(baseQuery, whereClause, ` ORDER BY claim_id DESC LIMIT ${offsetValue}, ${limitValue}`);
    sql:ParameterizedQuery countQuery = sql:queryConcat(countBaseQuery, whereClause);
    
    // Execute query to get claims
    stream<ClaimRecord, error?> claimStream = dbClient->query(fullQuery);
    
    ClaimRecord[]|error claims = from ClaimRecord claim in claimStream select claim;
    check claimStream.close();
    
    if claims is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to retrieve claims: " + claims.message()
        });
        return response;
    }
    
    // Get total count for pagination
    stream<record{int total;}, error?> countStream = dbClient->query(countQuery);
    
    record{int total;}[]|error countResult = from record{int total;} count in countStream select count;
    check countStream.close();
    
    int totalCount = 0;
    if countResult is record{int total;}[] && countResult.length() > 0 {
        totalCount = countResult[0].total;
    }
    
    // Format response data
    json[] claimData = [];
    foreach ClaimRecord claim in claims {
        claimData.push({
            "claimId": claim.claim_id,
            "patientId": claim.patient_id,
            "policyId": claim.policy_id,
            "providerId": claim.provider_id,
            "diagnosisCode": claim.diagnosis_code,
            "procedureCode": claim.procedure_code,
            "amount": claim.claim_amount,
            "status": claim.status,
            "decisionReason": claim.decision_reason
        });
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "data": claimData,
        "pagination": {
            "offset": offsetValue,
            "limit": limitValue,
            "total": totalCount,
            "hasMore": offsetValue + limitValue < totalCount
        }
    });
    
    return response;
}

// Validate claim data
function validateClaim(Claim claim) returns error? {
    if claim.id.trim() == "" {
        return error("Claim ID is required");
    }
    
    if claim.patient.reference.trim() == "" {
        return error("Patient reference is required");
    }
    
    // Validate patient reference format
    string patientId = extractStringIdFromReference(claim.patient.reference);
    if patientId.trim() == "" {
        return error("Valid patient ID is required");
    }
    
    if claim.total.value <= 0d {
        return error("Claim amount must be greater than 0");
    }
    
    if claim.diagnosis.length() == 0 {
        return error("At least one diagnosis is required");
    }
    
    if claim.item.length() == 0 {
        return error("At least one item is required");
    }
    
    return;
}

// Helper function to extract numeric ID from reference (kept for backward compatibility)
function extractIdFromReference(string reference) returns int|error {
    string stringId = extractStringIdFromReference(reference);
    return check int:fromString(stringId);
}

// Helper function to extract string ID from reference
function extractStringIdFromReference(string reference) returns string {
    if reference.trim() == "" {
        return "";
    }
    
    string[] parts = re`/`.split(reference);
    if parts.length() < 2 {
        return reference; // Return the whole reference if no slash found
    }
    
    string id = parts[parts.length() - 1].trim();
    return id == "" ? reference : id;
}