import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;

// Insurer record type
public type Insurer record {
    string insurer_id;
    string name;
};

// Insurer creation request
public type InsurerCreateRequest record {
    string? insurer_id; // Optional - if not provided, will be auto-generated
    string name;
};

// Insurer update request
public type InsurerUpdateRequest record {
    string? name;
};

// Create a new insurer
public function createInsurer(mysql:Client dbClient, InsurerCreateRequest insurerRequest) returns http:Response|error {
    http:Response response = new;
    
    // Validate insurer data
    error? validationResult = validateInsurerData(insurerRequest.name);
    if validationResult is error {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": validationResult.message()
        });
        return response;
    }
    
    // Check if insurer_id is provided, otherwise auto-generate
    string insurerId;
    if insurerRequest.insurer_id is string {
        insurerId = insurerRequest.insurer_id.toString();
        
        // Check if insurer ID already exists
        stream<record{int count;}, error?> countStream = dbClient->query(
            `SELECT COUNT(*) as count FROM insurers WHERE insurer_id = ${insurerId}`
        );
        
        record{int count;}[]|error countResult = from record{int count;} count in countStream select count;
        check countStream.close();
        
        if countResult is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while checking insurer ID"
            });
            return response;
        }
        
        if countResult.length() > 0 && countResult[0].count > 0 {
            response.statusCode = 409;
            response.setJsonPayload({
                "success": false,
                "message": string `Insurer with ID '${insurerId}' already exists`
            });
            return response;
        }
    } else {
        // Auto-generate insurer ID
        insurerId = generateInsurerId(dbClient);
    }
    
    // Insert insurer into database
    sql:ExecutionResult|error result = dbClient->execute(`
        INSERT INTO insurers (insurer_id, name)
        VALUES (${insurerId}, ${insurerRequest.name})
    `);
    
    if result is error {
        if result.message().includes("Duplicate entry") {
            response.statusCode = 409;
            response.setJsonPayload({
                "success": false,
                "message": string `Insurer with ID '${insurerId}' already exists`
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while creating insurer: " + result.message()
            });
        }
        return response;
    }
    
    if result.affectedRowCount > 0 {
        // Get the created insurer
        Insurer|error createdInsurer = getInsurerById(dbClient, insurerId);
        if createdInsurer is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Insurer created but failed to retrieve: " + createdInsurer.message()
            });
            return response;
        }
        
        response.statusCode = 201;
        response.setJsonPayload({
            "success": true,
            "message": "Insurer created successfully",
            "insurer": createdInsurer.toJson()
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to create insurer - no rows affected"
        });
    }
    
    return response;
}

// Get insurer by ID
public function getInsurer(mysql:Client dbClient, string insurerId) returns http:Response|error {
    http:Response response = new;
    
    Insurer|error insurer = getInsurerById(dbClient, insurerId);
    if insurer is error {
        if insurer.message().includes("not found") {
            response.statusCode = 404;
            response.setJsonPayload({
                "success": false,
                "message": string `Insurer with ID '${insurerId}' not found`
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while retrieving insurer: " + insurer.message()
            });
        }
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "insurer": insurer.toJson()
    });
    
    return response;
}

// Get all insurers with optional pagination
public function getAllInsurers(mysql:Client dbClient, int? offset = 0, int? 'limit = 50) returns http:Response|error {
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
    
    stream<Insurer, error?> insurerStream = dbClient->query(
        `SELECT insurer_id, name FROM insurers 
         ORDER BY insurer_id LIMIT ${limitValue} OFFSET ${offsetValue}`
    );
    
    Insurer[]|error insurers = from Insurer insurer in insurerStream select insurer;
    check insurerStream.close();
    
    if insurers is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while retrieving insurers: " + insurers.message()
        });
        return response;
    }
    
    // Get total count
    stream<record{int total;}, error?> countStream = dbClient->query(
        `SELECT COUNT(*) as total FROM insurers`
    );
    
    record{int total;}[]|error countResult = from record{int total;} count in countStream select count;
    check countStream.close();
    
    int totalInsurers = 0;
    if countResult is record{int total;}[] && countResult.length() > 0 {
        totalInsurers = countResult[0].total;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "insurers": insurers.toJson(),
        "pagination": {
            "offset": offsetValue,
            "limit": limitValue,
            "total": totalInsurers,
            "hasMore": (offsetValue + limitValue) < totalInsurers
        }
    });
    
    return response;
}

// Update insurer
public function updateInsurer(mysql:Client dbClient, string insurerId, InsurerUpdateRequest updateRequest) returns http:Response|error {
    http:Response response = new;
    
    // Check if insurer exists
    Insurer|error existingInsurer = getInsurerById(dbClient, insurerId);
    if existingInsurer is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Insurer with ID '${insurerId}' not found`
        });
        return response;
    }
    
    // Validate the update request
    if updateRequest.name is string {
        error? nameValidation = validateInsurerName(updateRequest.name.toString());
        if nameValidation is error {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": nameValidation.message()
            });
            return response;
        }
    } else {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": "No fields to update"
        });
        return response;
    }
    
    // Update insurer in database
    sql:ExecutionResult|error result = dbClient->execute(`
        UPDATE insurers SET name = ${updateRequest.name} WHERE insurer_id = ${insurerId}
    `);
    
    if result is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while updating insurer: " + result.message()
        });
        return response;
    }
    
    if result.affectedRowCount > 0 {
        // Get the updated insurer
        Insurer|error updatedInsurer = getInsurerById(dbClient, insurerId);
        if updatedInsurer is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Insurer updated but failed to retrieve: " + updatedInsurer.message()
            });
            return response;
        }
        
        response.statusCode = 200;
        response.setJsonPayload({
            "success": true,
            "message": "Insurer updated successfully",
            "insurer": updatedInsurer.toJson()
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to update insurer - no rows affected"
        });
    }
    
    return response;
}

// Delete insurer
public function deleteInsurer(mysql:Client dbClient, string insurerId) returns http:Response|error {
    http:Response response = new;
    
    // Check if insurer exists
    Insurer|error existingInsurer = getInsurerById(dbClient, insurerId);
    if existingInsurer is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Insurer with ID '${insurerId}' not found`
        });
        return response;
    }
    
    // Check if insurer has associated policies
    stream<record{int policy_count;}, error?> policyCountStream = dbClient->query(
        `SELECT COUNT(*) as policy_count FROM policies WHERE insurer_id = ${insurerId}`
    );
    
    record{int policy_count;}[]|error policyCountResult = from record{int policy_count;} count in policyCountStream select count;
    check policyCountStream.close();
    
    if policyCountResult is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while checking insurer dependencies"
        });
        return response;
    }
    
    if policyCountResult.length() > 0 && policyCountResult[0].policy_count > 0 {
        response.statusCode = 409;
        response.setJsonPayload({
            "success": false,
            "message": string `Cannot delete insurer '${insurerId}': Insurer has ${policyCountResult[0].policy_count} associated policies. Please remove all policies first.`
        });
        return response;
    }
    
    // Delete insurer
    sql:ExecutionResult|error result = dbClient->execute(`
        DELETE FROM insurers WHERE insurer_id = ${insurerId}
    `);
    
    if result is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while deleting insurer: " + result.message()
        });
        return response;
    }
    
    if result.affectedRowCount > 0 {
        response.statusCode = 200;
        response.setJsonPayload({
            "success": true,
            "message": string `Insurer with ID '${insurerId}' deleted successfully`
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to delete insurer - no rows affected"
        });
    }
    
    return response;
}

// Search insurers by name
public function searchInsurers(mysql:Client dbClient, string searchTerm, int? offset = 0, int? 'limit = 50) returns http:Response|error {
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
    
    string searchPattern = "%" + searchTerm + "%";
    
    stream<Insurer, error?> insurerStream = dbClient->query(
        `SELECT insurer_id, name FROM insurers 
         WHERE name LIKE ${searchPattern} OR insurer_id LIKE ${searchPattern}
         ORDER BY insurer_id LIMIT ${limitValue} OFFSET ${offsetValue}`
    );
    
    Insurer[]|error insurers = from Insurer insurer in insurerStream select insurer;
    check insurerStream.close();
    
    if insurers is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while searching insurers: " + insurers.message()
        });
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "insurers": insurers.toJson(),
        "searchTerm": searchTerm,
        "pagination": {
            "offset": offsetValue,
            "limit": limitValue
        }
    });
    
    return response;
}

// Get insurer statistics (policies count, claims count, etc.)
public function getInsurerStatistics(mysql:Client dbClient, string insurerId) returns http:Response|error {
    http:Response response = new;
    
    // Check if insurer exists
    Insurer|error existingInsurer = getInsurerById(dbClient, insurerId);
    if existingInsurer is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Insurer with ID '${insurerId}' not found`
        });
        return response;
    }
    
    // Get policy count
    stream<record{int policy_count;}, error?> policyCountStream = dbClient->query(
        `SELECT COUNT(*) as policy_count FROM policies WHERE insurer_id = ${insurerId}`
    );
    
    record{int policy_count;}[]|error policyCountResult = from record{int policy_count;} count in policyCountStream select count;
    check policyCountStream.close();
    
    int policyCount = 0;
    if policyCountResult is record{int policy_count;}[] && policyCountResult.length() > 0 {
        policyCount = policyCountResult[0].policy_count;
    }
    
    // Get active policy count
    stream<record{int active_policies;}, error?> activePolicyStream = dbClient->query(
        `SELECT COUNT(*) as active_policies FROM policies WHERE insurer_id = ${insurerId} AND status = 'Active'`
    );
    
    record{int active_policies;}[]|error activePolicyResult = from record{int active_policies;} count in activePolicyStream select count;
    check activePolicyStream.close();
    
    int activePolicyCount = 0;
    if activePolicyResult is record{int active_policies;}[] && activePolicyResult.length() > 0 {
        activePolicyCount = activePolicyResult[0].active_policies;
    }
    
    // Get claims count for this insurer's policies
    stream<record{int claim_count;}, error?> claimCountStream = dbClient->query(
        `SELECT COUNT(*) as claim_count FROM claims c 
         JOIN policies p ON c.policy_id = p.policy_id 
         WHERE p.insurer_id = ${insurerId}`
    );
    
    record{int claim_count;}[]|error claimCountResult = from record{int claim_count;} count in claimCountStream select count;
    check claimCountStream.close();
    
    int claimCount = 0;
    if claimCountResult is record{int claim_count;}[] && claimCountResult.length() > 0 {
        claimCount = claimCountResult[0].claim_count;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "insurer": existingInsurer.toJson(),
        "statistics": {
            "totalPolicies": policyCount,
            "activePolicies": activePolicyCount,
            "totalClaims": claimCount
        }
    });
    
    return response;
}

// Helper function to get insurer by ID
function getInsurerById(mysql:Client dbClient, string insurerId) returns Insurer|error {
    stream<Insurer, error?> insurerStream = dbClient->query(
        `SELECT insurer_id, name FROM insurers WHERE insurer_id = ${insurerId}`
    );
    
    Insurer[]|error insurers = from Insurer insurer in insurerStream select insurer;
    check insurerStream.close();
    
    if insurers is error {
        return error("Database error while retrieving insurer");
    }
    
    if insurers.length() == 0 {
        return error("Insurer not found");
    }
    
    return insurers[0];
}

// Generate a unique insurer ID
function generateInsurerId(mysql:Client dbClient) returns string {
    // Get the highest existing ID number
    stream<record{string max_id;}, error?> maxIdStream = dbClient->query(
        `SELECT MAX(CAST(SUBSTRING(insurer_id, 4) AS UNSIGNED)) as max_id 
         FROM insurers WHERE insurer_id LIKE 'INS%'`
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
    
    // Format as INS001, INS002, etc.
    return string `INS${nextNumber.toString().padZero(3)}`;
}

// Validation functions
function validateInsurerData(string name) returns error? {
    return validateInsurerName(name);
}

function validateInsurerName(string name) returns error? {
    if name.trim() == "" {
        return error("Insurer name is required");
    }
    
    if name.length() > 100 {
        return error("Insurer name cannot exceed 100 characters");
    }
    
    // Check for minimum length
    if name.trim().length() < 2 {
        return error("Insurer name must be at least 2 characters long");
    }
    
    return;
}