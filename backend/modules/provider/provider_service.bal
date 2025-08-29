import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;
    import ballerina/random;


// Provider record type
public type Provider record {
    string provider_id;
    string name;
    string 'type;
};

// Provider creation request
public type ProviderCreateRequest record {
    string? provider_id; // Optional - if not provided, will be auto-generated
    string name;
    string 'type;
};

// Provider update request
public type ProviderUpdateRequest record {
    string? name;
    string? 'type;
};

// Create a new provider
public function createProvider(mysql:Client dbClient, ProviderCreateRequest providerRequest) returns http:Response|error {
    http:Response response = new;
    
    // Validate provider data
    error? validationResult = validateProviderData(providerRequest.name, providerRequest.'type);
    if validationResult is error {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": validationResult.message()
        });
        return response;
    }
    
    // Check if provider_id is provided, otherwise auto-generate
    string providerId;
    if providerRequest.provider_id is string {
        providerId = providerRequest.provider_id.toString();
        
        // Check if provider ID already exists
        stream<record{int count;}, error?> countStream = dbClient->query(
            `SELECT COUNT(*) as count FROM providers WHERE provider_id = ${providerId}`
        );
        
        record{int count;}[]|error countResult = from record{int count;} count in countStream select count;
        check countStream.close();
        
        if countResult is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while checking provider ID"
            });
            return response;
        }
        
        if countResult.length() > 0 && countResult[0].count > 0 {
            response.statusCode = 409;
            response.setJsonPayload({
                "success": false,
                "message": string `Provider with ID '${providerId}' already exists`
            });
            return response;
        }
    } else {
        // Auto-generate provider ID based on type
        providerId = generateProviderId(dbClient, providerRequest.'type);
    }
    
    // Insert provider into database
    sql:ExecutionResult|error result = dbClient->execute(`
        INSERT INTO providers (provider_id, name, type)
        VALUES (${providerId}, ${providerRequest.name}, ${providerRequest.'type})
    `);
    
    if result is error {
        if result.message().includes("Duplicate entry") {
            response.statusCode = 409;
            response.setJsonPayload({
                "success": false,
                "message": string `Provider with ID '${providerId}' already exists`
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while creating provider: " + result.message()
            });
        }
        return response;
    }
    
    if result.affectedRowCount > 0 {
        // Get the created provider
        Provider|error createdProvider = getProviderById(dbClient, providerId);
        if createdProvider is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Provider created but failed to retrieve: " + createdProvider.message()
            });
            return response;
        }
        
        response.statusCode = 201;
        response.setJsonPayload({
            "success": true,
            "message": "Provider created successfully",
            "provider": createdProvider.toString()
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to create provider - no rows affected"
        });
    }
    
    return response;
}

// Get provider by ID
public function getProvider(mysql:Client dbClient, string providerId) returns http:Response|error {
    http:Response response = new;
    
    Provider|error provider = getProviderById(dbClient, providerId);
    if provider is error {
        if provider.message().includes("not found") {
            response.statusCode = 404;
            response.setJsonPayload({
                "success": false,
                "message": string `Provider with ID '${providerId}' not found`
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while retrieving provider: " + provider.message()
            });
        }
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "provider": provider.toString()
    });
    
    return response;
}

// Get all providers with optional pagination and type filtering
public function getAllProviders(mysql:Client dbClient, string? providerType = (), int? offset = 0, int? 'limit = 50) returns http:Response|error {
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
    
    // Build query with optional type filter
    sql:ParameterizedQuery query;
    sql:ParameterizedQuery countQuery;
    
    if providerType is string {
        query = `SELECT provider_id, name, type FROM providers 
                 WHERE type = ${providerType}
                 ORDER BY provider_id LIMIT ${limitValue} OFFSET ${offsetValue}`;
        countQuery = `SELECT COUNT(*) as total FROM providers WHERE type = ${providerType}`;
    } else {
        query = `SELECT provider_id, name, type FROM providers 
                 ORDER BY provider_id LIMIT ${limitValue} OFFSET ${offsetValue}`;
        countQuery = `SELECT COUNT(*) as total FROM providers`;
    }
    
    stream<Provider, error?> providerStream = dbClient->query(query);
    
    Provider[]|error providers = from Provider provider in providerStream select provider;
    check providerStream.close();
    
    if providers is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while retrieving providers: " + providers.message()
        });
        return response;
    }
    
    // Get total count
    stream<record{int total;}, error?> countStream = dbClient->query(countQuery);
    
    record{int total;}[]|error countResult = from record{int total;} count in countStream select count;
    check countStream.close();
    
    int totalProviders = 0;
    if countResult is record{int total;}[] && countResult.length() > 0 {
        totalProviders = countResult[0].total;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "providers": providers.toString(),
        "filter": {
            "type": providerType
        },
        "pagination": {
            "offset": offsetValue,
            "limit": limitValue,
            "total": totalProviders,
            "hasMore": (offsetValue + limitValue) < totalProviders
        }
    });
    
    return response;
}

// Update provider
public function updateProvider(mysql:Client dbClient, string providerId, ProviderUpdateRequest updateRequest) returns http:Response|error {
    http:Response response = new;
    
    // Check if provider exists
    Provider|error existingProvider = getProviderById(dbClient, providerId);
    if existingProvider is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Provider with ID '${providerId}' not found`
        });
        return response;
    }
    
    // Build dynamic update query
    sql:ParameterizedQuery updateQuery = `UPDATE providers SET `;
    boolean hasUpdates = false;
    
    if updateRequest.name is string {
        // Validate name
        error? nameValidation = validateProviderName(updateRequest.name.toString());
        if nameValidation is error {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": nameValidation.message()
            });
            return response;
        }
        updateQuery = sql:queryConcat(updateQuery, `name = ${updateRequest.name}`);
        hasUpdates = true;
    }
    
    if updateRequest.'type is string {
        // Validate type
        if !isValidProviderType(updateRequest.'type.toString()) {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": "Invalid provider type. Valid types: Doctor, Hospital, Clinic, Laboratory, Pharmacy"
            });
            return response;
        }
        
        if hasUpdates {
            updateQuery = sql:queryConcat(updateQuery, `, type = ${updateRequest.'type}`);
        } else {
            updateQuery = sql:queryConcat(updateQuery, `type = ${updateRequest.'type}`);
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
    
    updateQuery = sql:queryConcat(updateQuery, ` WHERE provider_id = ${providerId}`);
    
    // Execute update
    sql:ExecutionResult|error result = dbClient->execute(updateQuery);
    
    if result is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while updating provider: " + result.message()
        });
        return response;
    }
    
    if result.affectedRowCount > 0 {
        // Get the updated provider
        Provider|error updatedProvider = getProviderById(dbClient, providerId);
        if updatedProvider is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Provider updated but failed to retrieve: " + updatedProvider.message()
            });
            return response;
        }
        
        response.statusCode = 200;
        response.setJsonPayload({
            "success": true,
            "message": "Provider updated successfully",
            "provider": updatedProvider.toJson()
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to update provider - no rows affected"
        });
    }
    
    return response;
}

// Delete provider
public function deleteProvider(mysql:Client dbClient, string providerId) returns http:Response|error {
    http:Response response = new;
    
    // Check if provider exists
    Provider|error existingProvider = getProviderById(dbClient, providerId);
    if existingProvider is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Provider with ID '${providerId}' not found`
        });
        return response;
    }
    
    // Check if provider has associated claims
    stream<record{int claim_count;}, error?> claimCountStream = dbClient->query(
        `SELECT COUNT(*) as claim_count FROM claims WHERE provider_id = ${providerId}`
    );
    
    record{int claim_count;}[]|error claimCountResult = from record{int claim_count;} count in claimCountStream select count;
    check claimCountStream.close();
    
    if claimCountResult is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while checking provider dependencies"
        });
        return response;
    }
    
    if claimCountResult.length() > 0 && claimCountResult[0].claim_count > 0 {
        response.statusCode = 409;
        response.setJsonPayload({
            "success": false,
            "message": string `Cannot delete provider '${providerId}': Provider has ${claimCountResult[0].claim_count} associated claims. Please remove all claims first.`
        });
        return response;
    }
    
    // Delete provider
    sql:ExecutionResult|error result = dbClient->execute(`
        DELETE FROM providers WHERE provider_id = ${providerId}
    `);
    
    if result is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while deleting provider: " + result.message()
        });
        return response;
    }
    
    if result.affectedRowCount > 0 {
        response.statusCode = 200;
        response.setJsonPayload({
            "success": true,
            "message": string `Provider with ID '${providerId}' deleted successfully`
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to delete provider - no rows affected"
        });
    }
    
    return response;
}

// Search providers by name or type
public function searchProviders(mysql:Client dbClient, string searchTerm, int? offset = 0, int? 'limit = 50) returns http:Response|error {
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
    
    stream<Provider, error?> providerStream = dbClient->query(
        `SELECT provider_id, name, type FROM providers 
         WHERE name LIKE ${searchPattern} OR provider_id LIKE ${searchPattern} OR type LIKE ${searchPattern}
         ORDER BY provider_id LIMIT ${limitValue} OFFSET ${offsetValue}`
    );
    
    Provider[]|error providers = from Provider provider in providerStream select provider;
    check providerStream.close();
    
    if providers is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while searching providers: " + providers.message()
        });
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "providers": providers.toJson(),
        "searchTerm": searchTerm,
        "pagination": {
            "offset": offsetValue,
            "limit": limitValue
        }
    });
    
    return response;
}

// Get provider statistics (claims count, total claim amounts, etc.)
public function getProviderStatistics(mysql:Client dbClient, string providerId) returns http:Response|error {
    http:Response response = new;
    
    // Check if provider exists
    Provider|error existingProvider = getProviderById(dbClient, providerId);
    if existingProvider is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Provider with ID '${providerId}' not found`
        });
        return response;
    }
    
    // Get claim count and total amounts
    stream<record{int claim_count; decimal total_amount; decimal avg_amount;}, error?> statsStream = dbClient->query(
        `SELECT 
            COUNT(*) as claim_count,
            COALESCE(SUM(claim_amount), 0) as total_amount,
            COALESCE(AVG(claim_amount), 0) as avg_amount
         FROM claims WHERE provider_id = ${providerId}`
    );
    
    record{int claim_count; decimal total_amount; decimal avg_amount;}[]|error statsResult = 
        from record{int claim_count; decimal total_amount; decimal avg_amount;} stats in statsStream select stats;
    check statsStream.close();
    
    int claimCount = 0;
    decimal totalAmount = 0.0;
    decimal avgAmount = 0.0;
    
    if statsResult is record{int claim_count; decimal total_amount; decimal avg_amount;}[] && statsResult.length() > 0 {
        claimCount = statsResult[0].claim_count;
        totalAmount = statsResult[0].total_amount;
        avgAmount = statsResult[0].avg_amount;
    }
    
    // Get claim status breakdown
    stream<record{string status; int count;}, error?> statusStream = dbClient->query(
        `SELECT status, COUNT(*) as count 
         FROM claims WHERE provider_id = ${providerId} 
         GROUP BY status`
    );
    
    record{string status; int count;}[]|error statusResult = 
        from record{string status; int count;} status in statusStream select status;
    check statusStream.close();
    
    map<int> statusBreakdown = {};
    if statusResult is record{string status; int count;}[] {
        foreach var statusRecord in statusResult {
            statusBreakdown[statusRecord.status] = statusRecord.count;
        }
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "provider": existingProvider.toJson(),
        "statistics": {
            "totalClaims": claimCount,
            "totalClaimAmount": totalAmount,
            "averageClaimAmount": avgAmount,
            "claimStatusBreakdown": statusBreakdown
        }
    });
    
    return response;
}

// Helper function to get provider by ID
function getProviderById(mysql:Client dbClient, string providerId) returns Provider|error {
    stream<Provider, error?> providerStream = dbClient->query(
        `SELECT provider_id, name, type FROM providers WHERE provider_id = ${providerId}`
    );
    
    Provider[]|error providers = from Provider provider in providerStream select provider;
    check providerStream.close();
    
    if providers is error {
        return error("Database error while retrieving provider");
    }
    
    if providers.length() == 0 {
        return error("Provider not found");
    }
    
    return providers[0];
}

// Generate a unique provider ID based on type
function generateProviderId(mysql:Client dbClient, string providerType) returns string {
    string prefix;
    if providerType == "Doctor" {
        prefix = "DR";
    } else if providerType == "Hospital" {
        prefix = "HOSP";
    } else if providerType == "Clinic" {
        prefix = "CLIN";
    } else if providerType == "Laboratory" {
        prefix = "LAB";
    } else if providerType == "Pharmacy" {
        prefix = "PHRM";
    } else {
        prefix = "PROV";
    }
    // Use ballerina/lang.random to generate a random number
    int randomNum = 10000;
    var randResult = random:createIntInRange(10000, 99999);
    if randResult is int {
        randomNum = randResult;
    }
    return string `${prefix}${randomNum}`;
}

// Validation functions
function validateProviderData(string name, string providerType) returns error? {
    error? nameValidation = validateProviderName(name);
    if nameValidation is error {
        return nameValidation;
    }
    
    if !isValidProviderType(providerType) {
        return error("Invalid provider type. Valid types: Doctor, Hospital, Clinic, Laboratory, Pharmacy");
    }
    
    return;
}

function validateProviderName(string name) returns error? {
    if name.trim() == "" {
        return error("Provider name is required");
    }
    
    if name.length() > 100 {
        return error("Provider name cannot exceed 100 characters");
    }
    
    // Check for minimum length
    if name.trim().length() < 2 {
        return error("Provider name must be at least 2 characters long");
    }
    
    return;
}

function isValidProviderType(string providerType) returns boolean {
    return providerType == "Doctor" || 
           providerType == "Hospital" || 
           providerType == "Clinic" || 
           providerType == "Laboratory" || 
           providerType == "Pharmacy";
}