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
    string patientId = extractStringIdFromReference(patientRef);  // Use string extraction
    
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
    
    // Insert claim into database
    sql:ExecutionResult result = check dbClient->execute(`
        INSERT INTO claims (claim_id, patient_id, policy_id, provider_id, diagnosis_code, procedure_code, claim_amount, status, decision_reason)
        VALUES (${claimId}, ${patientId}, ${policyId}, ${providerId}, ${diagnosisCode}, ${procedureCode}, ${totalAmount}, 'Submitted', 'Pending review')
    `);
    
    if result.affectedRowCount > 0 {
        // Process the claim automatically
        ClaimResponse claimResponse = check processClaimById(dbClient, claimId);
        
        response.statusCode = 201;
        response.setJsonPayload({
            "success": true,
            "message": "Claim submitted and processed successfully",
            "claimResponse": claimResponse.toJson()
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to submit claim"
        });
    }
    
    return response;
}

// Process a claim and generate response
function processClaim(Claim claim) returns ClaimResponse|error {
    // Generate a unique response ID
    string responseId = "resp_" + uuid:createType1AsString().substring(0, 8);
    
    // Basic claim processing logic
    string outcome = "complete";
    string status = "active";
    string disposition = "Approved - Covered under policy";
    
    // Simple approval logic based on amount
    if claim.total.value > 5000d {
        disposition = "Partially Approved - Amount exceeds limit";
    }
    
    ClaimResponse claimResponse = {
        resourceType: "ClaimResponse",
        id: responseId,
        request: { reference: "Claim/" + claim.id },
        outcome: outcome,
        status: status,
        patient: claim.patient,
        insurer: claim.insurer,
        disposition: disposition,
        payment: {
            amount: claim.total
        }
    };
    
    return claimResponse;
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
        patient: { reference: "Patient/" + claim.patient_id },  // Use string patient_id
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