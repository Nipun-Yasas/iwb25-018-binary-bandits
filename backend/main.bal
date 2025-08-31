import ballerina/http;
import ballerinax/mysql;
import backend.auth;
import backend.claim;
import backend.person;
import backend.provider;
import backend.policie;
import backend.insurer;
import backend.statistics;

// Database configuration
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "binary_bandits";
configurable string dbUser = "root";
configurable string dbPassword = "";

// MySQL client
mysql:Client dbClient = check new (
    host = dbHost,
    port = dbPort,
    database = dbName,
    user = dbUser,
    password = dbPassword
);

// HTTP service with CORS configuration
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: true,
        allowHeaders: ["Authorization", "Content-Type"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}
service / on new http:Listener(8080) {
    
    // Health check endpoint
    resource function get hello() returns json {
        return {
            "status": "OK",
            "message": "Healthcare Claims Management API is running"
        };
    }

    // ========== AUTH ENDPOINTS ==========
    
    // Register endpoint
    resource function post register(auth:UserRegistration userReg) returns http:Response|error {
        return auth:registerUser(dbClient, userReg);
    }

    // Login endpoint
    resource function post login(auth:UserLogin userLogin) returns http:Response|error {
        return auth:loginUser(dbClient, userLogin);
    }

    // Logout endpoint (with session token)
    resource function post logout(@http:Header string? Authorization) returns http:Response|error {
        string sessionToken = Authorization ?: "";
        if sessionToken.startsWith("Bearer ") {
            sessionToken = sessionToken.substring(7);
        }
        return auth:logoutUser(sessionToken);
    }

    // Get user profile (protected endpoint)
    resource function get profile(@http:Header string? Authorization) returns http:Response|error {
        string sessionToken = Authorization ?: "";
        if sessionToken.startsWith("Bearer ") {
            sessionToken = sessionToken.substring(7);
        }
        return auth:getUserProfile(dbClient, sessionToken);
    }

    // Update user profile (protected endpoint)
    resource function put profile(@http:Header string? Authorization, auth:UserUpdate userUpdate) returns http:Response|error {
        string sessionToken = Authorization ?: "";
        if sessionToken.startsWith("Bearer ") {
            sessionToken = sessionToken.substring(7);
        }
        return auth:updateUserProfile(dbClient, sessionToken, userUpdate);
    }

    // ========== PATIENT ENDPOINTS ==========
    
    // Create a new patient
    resource function post patients(person:PatientCreateRequest patientRequest) returns http:Response|error {
        return person:createPatient(dbClient, patientRequest);
    }

    // Get patient by ID
    resource function get patients/[int patientId]() returns http:Response|error {
        return person:getPatient(dbClient, patientId);
    }

    // Get all patients with pagination
    resource function get patients(int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return person:getAllPatients(dbClient, offset, 'limit);
    }

    // Update patient
    resource function put patients/[int patientId](person:PatientUpdateRequest updateRequest) returns http:Response|error {
        return person:updatePatient(dbClient, patientId, updateRequest);
    }

    // Delete patient
    resource function delete patients/[int patientId]() returns http:Response|error {
        return person:deletePatient(dbClient, patientId);
    }

    // Search patients
    resource function get patients/search(string q, int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return person:searchPatients(dbClient, q, offset, 'limit);
    }

    // ========== PROVIDER ENDPOINTS ==========
    
    // Create a new provider
    resource function post providers(provider:ProviderCreateRequest providerRequest) returns http:Response|error {
        return provider:createProvider(dbClient, providerRequest);
    }

    // Get provider by ID
    resource function get providers/[string providerId]() returns http:Response|error {
        return provider:getProvider(dbClient, providerId);
    }

    // Get all providers with pagination and type filtering
    resource function get providers(string? 'type = (), int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return provider:getAllProviders(dbClient, 'type, offset, 'limit);
    }

    // Update provider
    resource function put providers/[string providerId](provider:ProviderUpdateRequest updateRequest) returns http:Response|error {
        return provider:updateProvider(dbClient, providerId, updateRequest);
    }

    // Delete provider
    resource function delete providers/[string providerId]() returns http:Response|error {
        return provider:deleteProvider(dbClient, providerId);
    }

    // Search providers
    resource function get providers/search(string q, int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return provider:searchProviders(dbClient, q, offset, 'limit);
    }

    // Get provider statistics
    resource function get providers/[string providerId]/statistics() returns http:Response|error {
        return provider:getProviderStatistics(dbClient, providerId);
    }

    // ========== INSURER ENDPOINTS ==========
    
    // Create a new insurer
    resource function post insurers(insurer:InsurerCreateRequest insurerRequest) returns http:Response|error {
        return insurer:createInsurer(dbClient, insurerRequest);
    }

    // Get insurer by ID
    resource function get insurers/[string insurerId]() returns http:Response|error {
        return insurer:getInsurer(dbClient, insurerId);
    }

    // Get all insurers with pagination
    resource function get insurers(int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return insurer:getAllInsurers(dbClient, offset, 'limit);
    }

    // Update insurer
    resource function put insurers/[string insurerId](insurer:InsurerUpdateRequest updateRequest) returns http:Response|error {
        return insurer:updateInsurer(dbClient, insurerId, updateRequest);
    }

    // Delete insurer
    resource function delete insurers/[string insurerId]() returns http:Response|error {
        return insurer:deleteInsurer(dbClient, insurerId);
    }

    // Search insurers
    resource function get insurers/search(string q, int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return insurer:searchInsurers(dbClient, q, offset, 'limit);
    }

    // Get insurer statistics
    resource function get insurers/[string insurerId]/statistics() returns http:Response|error {
        return insurer:getInsurerStatistics(dbClient, insurerId);
    }

    // ========== POLICY ENDPOINTS ==========
    
    // Create a new policy
    resource function post policies(policie:PolicyCreateRequest policyRequest) returns http:Response|error {
        return policie:createPolicy(dbClient, policyRequest);
    }

    // Get policy by ID
    resource function get policies/[string policyId]() returns http:Response|error {
        return policie:getPolicy(dbClient, policyId);
    }

    // Get policy details with related information
    resource function get policies/[string policyId]/details() returns http:Response|error {
        return policie:getPolicyDetails(dbClient, policyId);
    }

    // Get all policies with filtering and pagination
    resource function get policies(string? status = (), int? patientId = (), string? insurerId = (), int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return policie:getAllPolicies(dbClient, status, patientId, insurerId, offset, 'limit);
    }

    // Update policy
    resource function put policies/[string policyId](policie:PolicyUpdateRequest updateRequest) returns http:Response|error {
        return policie:updatePolicy(dbClient, policyId, updateRequest);
    }

    // Delete policy
    resource function delete policies/[string policyId]() returns http:Response|error {
        return policie:deletePolicy(dbClient, policyId);
    }

    // Get policies for a specific patient
    resource function get patients/[int patientId]/policies(int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return policie:getPatientPolicies(dbClient, patientId, offset, 'limit);
    }

    // Get policies for a specific insurer
    resource function get insurers/[string insurerId]/policies(int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return policie:getInsurerPolicies(dbClient, insurerId, offset, 'limit);
    }

    // ========== CLAIM ENDPOINTS ==========
    
    // Submit claim endpoint
    resource function post claims(claim:Claim claimData) returns http:Response|error {
        return claim:submitClaim(dbClient, claimData);
    }

    // Get claim status endpoint
    resource function get claims/[string claimId]() returns http:Response|error {
        return claim:getClaimStatus(dbClient, claimId);
    }

    // Get all claims with filtering and pagination
    resource function get claims(string? status = (), int? patientId = (), string? providerId = (), int? offset = 0, int? 'limit = 50) returns http:Response|error {
        return claim:getAllClaims(dbClient, status, patientId, providerId, offset, 'limit);
    }

    // ========== ADDITIONAL ENDPOINTS ==========
    
    // Get dashboard statistics
    resource function get dashboard/statistics() returns http:Response|error {
        return statistics:getDashboardStatistics(dbClient);
    }
    
    // Get system statistics
    resource function get statistics() returns json|error {
        // Get counts for all entities
        stream<record{int patient_count;}, error?> patientCountStream = dbClient->query(
            `SELECT COUNT(*) as patient_count FROM patients`
        );
        record{int patient_count;}[]|error patientCountResult = from record{int patient_count;} count in patientCountStream select count;
        check patientCountStream.close();

        stream<record{int provider_count;}, error?> providerCountStream = dbClient->query(
            `SELECT COUNT(*) as provider_count FROM providers`
        );
        record{int provider_count;}[]|error providerCountResult = from record{int provider_count;} count in providerCountStream select count;
        check providerCountStream.close();

        stream<record{int insurer_count;}, error?> insurerCountStream = dbClient->query(
            `SELECT COUNT(*) as insurer_count FROM insurers`
        );
        record{int insurer_count;}[]|error insurerCountResult = from record{int insurer_count;} count in insurerCountStream select count;
        check insurerCountStream.close();

        stream<record{int policy_count;}, error?> policyCountStream = dbClient->query(
            `SELECT COUNT(*) as policy_count FROM policies`
        );
        record{int policy_count;}[]|error policyCountResult = from record{int policy_count;} count in policyCountStream select count;
        check policyCountStream.close();

        stream<record{int claim_count;}, error?> claimCountStream = dbClient->query(
            `SELECT COUNT(*) as claim_count FROM claims`
        );
        record{int claim_count;}[]|error claimCountResult = from record{int claim_count;} count in claimCountStream select count;
        check claimCountStream.close();

        return {
            "status": "OK",
            "statistics": {
                "patients": patientCountResult is record{int patient_count;}[] && patientCountResult.length() > 0 ? patientCountResult[0].patient_count : 0,
                "providers": providerCountResult is record{int provider_count;}[] && providerCountResult.length() > 0 ? providerCountResult[0].provider_count : 0,
                "insurers": insurerCountResult is record{int insurer_count;}[] && insurerCountResult.length() > 0 ? insurerCountResult[0].insurer_count : 0,
                "policies": policyCountResult is record{int policy_count;}[] && policyCountResult.length() > 0 ? policyCountResult[0].policy_count : 0,
                "claims": claimCountResult is record{int claim_count;}[] && claimCountResult.length() > 0 ? claimCountResult[0].claim_count : 0
            }
        };
    }
}

// Initialize database tables on startup
public function main() returns error? {
    check auth:initializeDatabase(dbClient);
    return;
}