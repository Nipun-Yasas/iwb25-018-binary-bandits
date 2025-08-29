import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;

// Patient record type
public type Patient record {
    int patient_id;
    string name;
    string dob; // Date of birth in YYYY-MM-DD format
    string gender;
    string address;
};

// Patient creation request (without patient_id as it's auto-generated or specified)
public type PatientCreateRequest record {
    int? patient_id; // Optional - if not provided, will be auto-generated
    string name;
    string dob;
    string gender;
    string address;
};

// Patient update request
public type PatientUpdateRequest record {
    string? name;
    string? dob;
    string? gender;
    string? address;
};

// Create a new patient
public function createPatient(mysql:Client dbClient, PatientCreateRequest patientRequest) returns http:Response|error {
    http:Response response = new;
    
    // Validate patient data
    error? validationResult = validatePatientData(patientRequest.name, patientRequest.dob, patientRequest.gender, patientRequest.address);
    if validationResult is error {
        response.statusCode = 400;
        response.setJsonPayload({
            "success": false,
            "message": validationResult.message()
        });
        return response;
    }
    
    // Check if patient_id is provided, otherwise find the next available ID
    int patientId;
    if patientRequest.patient_id is int {
        patientId = patientRequest.patient_id ?: 0;
        
        // Check if patient ID already exists
        stream<record{int count;}, error?> countStream = dbClient->query(
            `SELECT COUNT(*) as count FROM patients WHERE patient_id = ${patientId}`
        );
        
        record{int count;}[]|error countResult = from record{int count;} count in countStream select count;
        check countStream.close();
        
        if countResult is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while checking patient ID"
            });
            return response;
        }
        
        if countResult.length() > 0 && countResult[0].count > 0 {
            response.statusCode = 409;
            response.setJsonPayload({
                "success": false,
                "message": string `Patient with ID '${patientId}' already exists`
            });
            return response;
        }
    } else {
        // Auto-generate patient ID
        stream<record{int max_id;}, error?> maxIdStream = dbClient->query(
            `SELECT COALESCE(MAX(patient_id), 0) as max_id FROM patients`
        );
        
        record{int max_id;}[]|error maxIdResult = from record{int max_id;} maxId in maxIdStream select maxId;
        check maxIdStream.close();
        
        if maxIdResult is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while generating patient ID"
            });
            return response;
        }
        
        patientId = maxIdResult.length() > 0 ? maxIdResult[0].max_id + 1 : 1;
    }
    
    // Insert patient into database
    sql:ExecutionResult|error result = dbClient->execute(`
        INSERT INTO patients (patient_id, name, dob, gender, address)
        VALUES (${patientId}, ${patientRequest.name}, ${patientRequest.dob}, ${patientRequest.gender}, ${patientRequest.address})
    `);
    
    if result is error {
        if result.message().includes("Duplicate entry") {
            response.statusCode = 409;
            response.setJsonPayload({
                "success": false,
                "message": string `Patient with ID '${patientId}' already exists`
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while creating patient: " + result.message()
            });
        }
        return response;
    }
    
    if result.affectedRowCount > 0 {
        // Get the created patient
        Patient|error createdPatient = getPatientById(dbClient, patientId);
        if createdPatient is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Patient created but failed to retrieve: " + createdPatient.message()
            });
            return response;
        }
        
        response.statusCode = 201;
        response.setJsonPayload({
            "success": true,
            "message": "Patient created successfully",
            "patient": createdPatient.toJson()
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to create patient - no rows affected"
        });
    }
    
    return response;
}

// Get patient by ID
public function getPatient(mysql:Client dbClient, int patientId) returns http:Response|error {
    http:Response response = new;
    
    Patient|error patient = getPatientById(dbClient, patientId);
    if patient is error {
        if patient.message().includes("not found") {
            response.statusCode = 404;
            response.setJsonPayload({
                "success": false,
                "message": string `Patient with ID '${patientId}' not found`
            });
        } else {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Database error while retrieving patient: " + patient.message()
            });
        }
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "patient": patient.toJson()
    });
    
    return response;
}

// Get all patients with optional pagination
public function getAllPatients(mysql:Client dbClient, int? offset = 0, int? 'limit = 50) returns http:Response|error {
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
    
    stream<Patient, error?> patientStream = dbClient->query(
        `SELECT patient_id, name, dob, gender, address FROM patients 
         ORDER BY patient_id LIMIT ${limitValue} OFFSET ${offsetValue}`
    );
    
    Patient[]|error patients = from Patient patient in patientStream select patient;
    check patientStream.close();
    
    if patients is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while retrieving patients: " + patients.message()
        });
        return response;
    }
    
    // Get total count
    stream<record{int total;}, error?> countStream = dbClient->query(
        `SELECT COUNT(*) as total FROM patients`
    );
    
    record{int total;}[]|error countResult = from record{int total;} count in countStream select count;
    check countStream.close();
    
    int totalPatients = 0;
    if countResult is record{int total;}[] && countResult.length() > 0 {
        totalPatients = countResult[0].total;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "patients": patients.toJson(),
        "pagination": {
            "offset": offsetValue,
            "limit": limitValue,
            "total": totalPatients,
            "hasMore": (offsetValue + limitValue) < totalPatients
        }
    });
    
    return response;
}

// Update patient
public function updatePatient(mysql:Client dbClient, int patientId, PatientUpdateRequest updateRequest) returns http:Response|error {
    http:Response response = new;
    
    // Check if patient exists
    Patient|error existingPatient = getPatientById(dbClient, patientId);
    if existingPatient is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Patient with ID '${patientId}' not found`
        });
        return response;
    }
    
    // Build dynamic update query
    string[] updateFields = [];
    sql:ParameterizedQuery updateQuery = `UPDATE patients SET `;
    boolean hasUpdates = false;
    
    if updateRequest.name is string {
        // Validate name
        if updateRequest.name.toString().trim() == "" {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": "Name cannot be empty"
            });
            return response;
        }
        updateFields.push("name = ?");
        updateQuery = sql:queryConcat(updateQuery, `name = ${updateRequest.name}`);
        hasUpdates = true;
    }
    
    if updateRequest.dob is string {
        // Validate date format
        error? dateValidation = validateDateFormat(updateRequest.dob.toString());
        if dateValidation is error {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": dateValidation.message()
            });
            return response;
        }
        
        if hasUpdates {
            updateQuery = sql:queryConcat(updateQuery, `, dob = ${updateRequest.dob}`);
        } else {
            updateQuery = sql:queryConcat(updateQuery, `dob = ${updateRequest.dob}`);
        }
        hasUpdates = true;
    }
    
    if updateRequest.gender is string {
        // Validate gender
        if !isValidGender(<string>updateRequest.gender) {
            response.statusCode = 400;
            response.setJsonPayload({
                "success": false,
                "message": "Gender must be 'Male', 'Female', or 'Other'"
            });
            return response;
        }
        
        if hasUpdates {
            updateQuery = sql:queryConcat(updateQuery, `, gender = ${updateRequest.gender}`);
        } else {
            updateQuery = sql:queryConcat(updateQuery, `gender = ${updateRequest.gender}`);
        }
        hasUpdates = true;
    }
    
    if updateRequest.address is string {
      
        
        if hasUpdates {
            updateQuery = sql:queryConcat(updateQuery, `, address = ${updateRequest.address}`);
        } else {
            updateQuery = sql:queryConcat(updateQuery, `address = ${updateRequest.address}`);
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
    
    updateQuery = sql:queryConcat(updateQuery, ` WHERE patient_id = ${patientId}`);
    
    // Execute update
    sql:ExecutionResult|error result = dbClient->execute(updateQuery);
    
    if result is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while updating patient: " + result.message()
        });
        return response;
    }
    
    if result.affectedRowCount > 0 {
        // Get the updated patient
        Patient|error updatedPatient = getPatientById(dbClient, patientId);
        if updatedPatient is error {
            response.statusCode = 500;
            response.setJsonPayload({
                "success": false,
                "message": "Patient updated but failed to retrieve: " + updatedPatient.message()
            });
            return response;
        }
        
        response.statusCode = 200;
        response.setJsonPayload({
            "success": true,
            "message": "Patient updated successfully",
            "patient": updatedPatient.toJson()
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to update patient - no rows affected"
        });
    }
    
    return response;
}

// Delete patient
public function deletePatient(mysql:Client dbClient, int patientId) returns http:Response|error {
    http:Response response = new;
    
    // Check if patient exists
    Patient|error existingPatient = getPatientById(dbClient, patientId);
    if existingPatient is error {
        response.statusCode = 404;
        response.setJsonPayload({
            "success": false,
            "message": string `Patient with ID '${patientId}' not found`
        });
        return response;
    }
    
    // Check if patient has associated policies or claims
    stream<record{int policy_count;}, error?> policyCountStream = dbClient->query(
        `SELECT COUNT(*) as policy_count FROM policies WHERE patient_id = ${patientId}`
    );
    
    record{int policy_count;}[]|error policyCountResult = from record{int policy_count;} count in policyCountStream select count;
    check policyCountStream.close();
    
    if policyCountResult is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while checking patient dependencies"
        });
        return response;
    }
    
    if policyCountResult.length() > 0 && policyCountResult[0].policy_count > 0 {
        response.statusCode = 409;
        response.setJsonPayload({
            "success": false,
            "message": string `Cannot delete patient '${patientId}': Patient has ${policyCountResult[0].policy_count} associated policies. Please remove all policies first.`
        });
        return response;
    }
    
    // Delete patient
    sql:ExecutionResult|error result = dbClient->execute(`
        DELETE FROM patients WHERE patient_id = ${patientId}
    `);
    
    if result is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while deleting patient: " + result.message()
        });
        return response;
    }
    
    if result.affectedRowCount > 0 {
        response.statusCode = 200;
        response.setJsonPayload({
            "success": true,
            "message": string `Patient with ID '${patientId}' deleted successfully`
        });
    } else {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Failed to delete patient - no rows affected"
        });
    }
    
    return response;
}

// Search patients by name or ID
public function searchPatients(mysql:Client dbClient, string searchTerm, int? offset = 0, int? 'limit = 50) returns http:Response|error {
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
    
    stream<Patient, error?> patientStream = dbClient->query(
        `SELECT patient_id, name, dob, gender, address FROM patients 
         WHERE name LIKE ${searchPattern} OR CAST(patient_id AS CHAR) LIKE ${searchPattern}
         ORDER BY patient_id LIMIT ${limitValue} OFFSET ${offsetValue}`
    );
    
    Patient[]|error patients = from Patient patient in patientStream select patient;
    check patientStream.close();
    
    if patients is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Database error while searching patients: " + patients.message()
        });
        return response;
    }
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "patients": patients.toJson(),
        "searchTerm": searchTerm,
        "pagination": {
            "offset": offsetValue,
            "limit": limitValue
        }
    });
    
    return response;
}

// Helper function to get patient by ID
function getPatientById(mysql:Client dbClient, int patientId) returns Patient|error {
    stream<Patient, error?> patientStream = dbClient->query(
        `SELECT patient_id, name, dob, gender, address FROM patients WHERE patient_id = ${patientId}`
    );
    
    Patient[]|error patients = from Patient patient in patientStream select patient;
    check patientStream.close();
    
    if patients is error {
        return error("Database error while retrieving patient");
    }
    
    if patients.length() == 0 {
        return error("Patient not found");
    }
    
    return patients[0];
}

// Validation functions
function validatePatientData(string name, string dob, string gender, string address) returns error? {
    if name.trim() == "" {
        return error("Name is required");
    }
    
    if name.length() > 100 {
        return error("Name cannot exceed 100 characters");
    }
    
    error? dateValidation = validateDateFormat(dob);
    if dateValidation is error {
        return dateValidation;
    }
    
    if !isValidGender(gender) {
        return error("Gender must be 'Male', 'Female', or 'Other'");
    }
    
    if address.trim() == "" {
        return error("Address is required");
    }
    
    if address.length() > 255 {
        return error("Address cannot exceed 255 characters");
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

function isValidGender(string gender) returns boolean {
    return gender == "Male" || gender == "Female" || gender == "Other";
}