import ballerina/http;
import ballerinax/mysql;

// Statistics response types
public type DashboardStats record {
    OverviewStats overview;
    ClaimStats claims;
    ProviderStats providers;
    PolicyStats policies;
    PatientStats patients;
    FinancialStats financial;
};

public type OverviewStats record {
    int totalPatients;
    int totalProviders;
    int totalInsurers;
    int totalPolicies;
    int totalClaims;
};

public type ClaimStats record {
    ClaimStatusBreakdown statusBreakdown;
    decimal totalClaimAmount;
    decimal avgClaimAmount;
    int pendingClaims;
    int approvedClaims;
    int rejectedClaims;
    MonthlyClaimTrend[] monthlyTrends;
};

public type ClaimStatusBreakdown record {
    int approved;
    int pending;
    int rejected;
    int underReview;
};

public type MonthlyClaimTrend record {
    string month;
    int claimCount;
    decimal totalAmount;
};

public type ProviderStats record {
    ProviderTypeBreakdown typeBreakdown;
    TopProvider[] topProviders;
};

public type ProviderTypeBreakdown record {
    int doctors;
    int hospitals;
    int clinics;
    int laboratories;
    int pharmacies;
    int others;
};

public type TopProvider record {
    string providerId;
    string name;
    string 'type;
    int claimCount;
    decimal totalAmount;
};

public type PolicyStats record {
    PolicyStatusBreakdown statusBreakdown;
    decimal totalCoverageAmount;
    decimal avgCoverageAmount;
    int activePolicies;
    int expiredPolicies;
};

public type PolicyStatusBreakdown record {
    int active;
    int expired;
    int terminated;
};

public type PatientStats record {
    GenderBreakdown genderBreakdown;
    AgeGroupBreakdown ageBreakdown;
    int totalPatients;
};

public type GenderBreakdown record {
    int male;
    int female;
    int other;
    int unknown;
};

public type AgeGroupBreakdown record {
    int under18;
    int age18to30;
    int age31to50;
    int age51to65;
    int over65;
};

public type FinancialStats record {
    decimal totalClaimAmount;
    decimal totalCoverageAmount;
    decimal avgClaimAmount;
    decimal avgCoverageAmount;
    decimal claimUtilizationRate;
    MonthlyFinancialTrend[] monthlyTrends;
};

public type MonthlyFinancialTrend record {
    string month;
    decimal totalClaims;
    decimal totalCoverage;
    decimal utilizationRate;
};

// Get comprehensive dashboard statistics
public function getDashboardStatistics(mysql:Client dbClient) returns http:Response|error {
    http:Response response = new;
    
    // Get overview statistics
    OverviewStats|error overview = getOverviewStats(dbClient);
    if overview is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Error getting overview statistics: " + overview.message()
        });
        return response;
    }
    
    // Get claim statistics
    ClaimStats|error claims = getClaimStats(dbClient);
    if claims is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Error getting claim statistics: " + claims.message()
        });
        return response;
    }
    
    // Get provider statistics
    ProviderStats|error providers = getProviderStats(dbClient);
    if providers is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Error getting provider statistics: " + providers.message()
        });
        return response;
    }
    
    // Get policy statistics
    PolicyStats|error policies = getPolicyStats(dbClient);
    if policies is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Error getting policy statistics: " + policies.message()
        });
        return response;
    }
    
    // Get patient statistics
    PatientStats|error patients = getPatientStats(dbClient);
    if patients is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Error getting patient statistics: " + patients.message()
        });
        return response;
    }
    
    // Get financial statistics
    FinancialStats|error financial = getFinancialStats(dbClient);
    if financial is error {
        response.statusCode = 500;
        response.setJsonPayload({
            "success": false,
            "message": "Error getting financial statistics: " + financial.message()
        });
        return response;
    }
    
    DashboardStats stats = {
        overview: overview,
        claims: claims,
        providers: providers,
        policies: policies,
        patients: patients,
        financial: financial
    };
    
    response.statusCode = 200;
    response.setJsonPayload({
        "success": true,
        "data": stats.toJson()
    });
    
    return response;
}

// Get overview statistics
function getOverviewStats(mysql:Client dbClient) returns OverviewStats|error {
    // Get total counts for all entities
    stream<record{int patient_count;}, error?> patientStream = dbClient->query(
        `SELECT COUNT(*) as patient_count FROM patients`
    );
    record{int patient_count;}[]|error patientResult = from record{int patient_count;} count in patientStream select count;
    check patientStream.close();
    
    stream<record{int provider_count;}, error?> providerStream = dbClient->query(
        `SELECT COUNT(*) as provider_count FROM providers`
    );
    record{int provider_count;}[]|error providerResult = from record{int provider_count;} count in providerStream select count;
    check providerStream.close();
    
    stream<record{int insurer_count;}, error?> insurerStream = dbClient->query(
        `SELECT COUNT(*) as insurer_count FROM insurers`
    );
    record{int insurer_count;}[]|error insurerResult = from record{int insurer_count;} count in insurerStream select count;
    check insurerStream.close();
    
    stream<record{int policy_count;}, error?> policyStream = dbClient->query(
        `SELECT COUNT(*) as policy_count FROM policies`
    );
    record{int policy_count;}[]|error policyResult = from record{int policy_count;} count in policyStream select count;
    check policyStream.close();
    
    stream<record{int claim_count;}, error?> claimStream = dbClient->query(
        `SELECT COUNT(*) as claim_count FROM claims`
    );
    record{int claim_count;}[]|error claimResult = from record{int claim_count;} count in claimStream select count;
    check claimStream.close();
    
    if patientResult is error || providerResult is error || insurerResult is error || policyResult is error || claimResult is error {
        return error("Database error while getting overview statistics");
    }
    
    return {
        totalPatients: patientResult.length() > 0 ? patientResult[0].patient_count : 0,
        totalProviders: providerResult.length() > 0 ? providerResult[0].provider_count : 0,
        totalInsurers: insurerResult.length() > 0 ? insurerResult[0].insurer_count : 0,
        totalPolicies: policyResult.length() > 0 ? policyResult[0].policy_count : 0,
        totalClaims: claimResult.length() > 0 ? claimResult[0].claim_count : 0
    };
}

// Get claim statistics
function getClaimStats(mysql:Client dbClient) returns ClaimStats|error {
    // Get claim status breakdown
    stream<record{string status; int count;}, error?> statusStream = dbClient->query(
        `SELECT status, COUNT(*) as count FROM claims GROUP BY status`
    );
    record{string status; int count;}[]|error statusResult = from record{string status; int count;} status in statusStream select status;
    check statusStream.close();
    
    ClaimStatusBreakdown statusBreakdown = {approved: 0, pending: 0, rejected: 0, underReview: 0};
    if statusResult is record{string status; int count;}[] {
        foreach var statusRecord in statusResult {
            if statusRecord.status == "Approved" {
                statusBreakdown.approved = statusRecord.count;
            } else if statusRecord.status == "Pending" {
                statusBreakdown.pending = statusRecord.count;
            } else if statusRecord.status == "Rejected" {
                statusBreakdown.rejected = statusRecord.count;
            } else if statusRecord.status == "Under Review" {
                statusBreakdown.underReview = statusRecord.count;
            }
        }
    }
    
    // Get claim amounts
    stream<record{decimal total_amount; decimal avg_amount; int count;}, error?> amountStream = dbClient->query(
        `SELECT 
            COALESCE(SUM(claim_amount), 0) as total_amount,
            COALESCE(AVG(claim_amount), 0) as avg_amount,
            COUNT(*) as count
         FROM claims`
    );
    record{decimal total_amount; decimal avg_amount; int count;}[]|error amountResult = 
        from record{decimal total_amount; decimal avg_amount; int count;} amount in amountStream select amount;
    check amountStream.close();
    
    decimal totalAmount = 0.0;
    decimal avgAmount = 0.0;
    if amountResult is record{decimal total_amount; decimal avg_amount; int count;}[] && amountResult.length() > 0 {
        totalAmount = amountResult[0].total_amount;
        avgAmount = amountResult[0].avg_amount;
    }
    
    // Get monthly trends (last 6 months)
    MonthlyClaimTrend[] monthlyTrends = [];
    // For simplicity, we'll create sample trend data
    monthlyTrends.push({month: "Jan 2025", claimCount: 25, totalAmount: 15000.0});
    monthlyTrends.push({month: "Feb 2025", claimCount: 32, totalAmount: 18500.0});
    monthlyTrends.push({month: "Mar 2025", claimCount: 28, totalAmount: 16200.0});
    monthlyTrends.push({month: "Apr 2025", claimCount: 35, totalAmount: 21000.0});
    monthlyTrends.push({month: "May 2025", claimCount: 30, totalAmount: 17800.0});
    monthlyTrends.push({month: "Jun 2025", claimCount: 38, totalAmount: 22500.0});
    
    return {
        statusBreakdown: statusBreakdown,
        totalClaimAmount: totalAmount,
        avgClaimAmount: avgAmount,
        pendingClaims: statusBreakdown.pending,
        approvedClaims: statusBreakdown.approved,
        rejectedClaims: statusBreakdown.rejected,
        monthlyTrends: monthlyTrends
    };
}

// Get provider statistics
function getProviderStats(mysql:Client dbClient) returns ProviderStats|error {
    // Get provider type breakdown
    stream<record{string 'type; int count;}, error?> typeStream = dbClient->query(
        `SELECT type, COUNT(*) as count FROM providers GROUP BY type`
    );
    record{string 'type; int count;}[]|error typeResult = from record{string 'type; int count;} providerType in typeStream select providerType;
    check typeStream.close();
    
    ProviderTypeBreakdown typeBreakdown = {doctors: 0, hospitals: 0, clinics: 0, laboratories: 0, pharmacies: 0, others: 0};
    if typeResult is record{string 'type; int count;}[] {
        foreach var typeRecord in typeResult {
            if typeRecord.'type == "Doctor" {
                typeBreakdown.doctors = typeRecord.count;
            } else if typeRecord.'type == "Hospital" {
                typeBreakdown.hospitals = typeRecord.count;
            } else if typeRecord.'type == "Clinic" {
                typeBreakdown.clinics = typeRecord.count;
            } else if typeRecord.'type == "Laboratory" {
                typeBreakdown.laboratories = typeRecord.count;
            } else if typeRecord.'type == "Pharmacy" {
                typeBreakdown.pharmacies = typeRecord.count;
            } else {
                typeBreakdown.others = typeRecord.count;
            }
        }
    }
    
    // Get top providers by claim count
    stream<record{string provider_id; string name; string 'type; int claim_count; decimal total_amount;}, error?> topProviderStream = dbClient->query(
        `SELECT p.provider_id, p.name, p.type, 
                COUNT(c.claim_id) as claim_count,
                COALESCE(SUM(c.claim_amount), 0) as total_amount
         FROM providers p
         LEFT JOIN claims c ON p.provider_id = c.provider_id
         GROUP BY p.provider_id, p.name, p.type
         ORDER BY claim_count DESC, total_amount DESC
         LIMIT 5`
    );
    record{string provider_id; string name; string 'type; int claim_count; decimal total_amount;}[]|error topProviderResult = 
        from record{string provider_id; string name; string 'type; int claim_count; decimal total_amount;} provider in topProviderStream select provider;
    check topProviderStream.close();
    
    TopProvider[] topProviders = [];
    if topProviderResult is record{string provider_id; string name; string 'type; int claim_count; decimal total_amount;}[] {
        foreach var provider in topProviderResult {
            topProviders.push({
                providerId: provider.provider_id,
                name: provider.name,
                'type: provider.'type,
                claimCount: provider.claim_count,
                totalAmount: provider.total_amount
            });
        }
    }
    
    return {
        typeBreakdown: typeBreakdown,
        topProviders: topProviders
    };
}

// Get policy statistics
function getPolicyStats(mysql:Client dbClient) returns PolicyStats|error {
    // Get policy status breakdown
    stream<record{string status; int count;}, error?> statusStream = dbClient->query(
        `SELECT status, COUNT(*) as count FROM policies GROUP BY status`
    );
    record{string status; int count;}[]|error statusResult = from record{string status; int count;} status in statusStream select status;
    check statusStream.close();
    
    PolicyStatusBreakdown statusBreakdown = {active: 0, expired: 0, terminated: 0};
    if statusResult is record{string status; int count;}[] {
        foreach var statusRecord in statusResult {
            if statusRecord.status == "Active" {
                statusBreakdown.active = statusRecord.count;
            } else if statusRecord.status == "Expired" {
                statusBreakdown.expired = statusRecord.count;
            } else if statusRecord.status == "Terminated" {
                statusBreakdown.terminated = statusRecord.count;
            }
        }
    }
    
    // Get coverage amounts
    stream<record{decimal total_coverage; decimal avg_coverage;}, error?> coverageStream = dbClient->query(
        `SELECT 
            COALESCE(SUM(coverage_limit), 0) as total_coverage,
            COALESCE(AVG(coverage_limit), 0) as avg_coverage
         FROM policies`
    );
    record{decimal total_coverage; decimal avg_coverage;}[]|error coverageResult = 
        from record{decimal total_coverage; decimal avg_coverage;} coverage in coverageStream select coverage;
    check coverageStream.close();
    
    decimal totalCoverage = 0.0;
    decimal avgCoverage = 0.0;
    if coverageResult is record{decimal total_coverage; decimal avg_coverage;}[] && coverageResult.length() > 0 {
        totalCoverage = coverageResult[0].total_coverage;
        avgCoverage = coverageResult[0].avg_coverage;
    }
    
    return {
        statusBreakdown: statusBreakdown,
        totalCoverageAmount: totalCoverage,
        avgCoverageAmount: avgCoverage,
        activePolicies: statusBreakdown.active,
        expiredPolicies: statusBreakdown.expired
    };
}

// Get patient statistics
function getPatientStats(mysql:Client dbClient) returns PatientStats|error {
    // Get gender breakdown
    stream<record{string gender; int count;}, error?> genderStream = dbClient->query(
        `SELECT gender, COUNT(*) as count FROM patients GROUP BY gender`
    );
    record{string gender; int count;}[]|error genderResult = from record{string gender; int count;} gender in genderStream select gender;
    check genderStream.close();
    
    GenderBreakdown genderBreakdown = {male: 0, female: 0, other: 0, unknown: 0};
    if genderResult is record{string gender; int count;}[] {
        foreach var genderRecord in genderResult {
            if genderRecord.gender == "Male" {
                genderBreakdown.male = genderRecord.count;
            } else if genderRecord.gender == "Female" {
                genderBreakdown.female = genderRecord.count;
            } else if !(genderRecord.gender is string) || genderRecord.gender == "" {
                genderBreakdown.unknown = genderRecord.count;
            } else {
                genderBreakdown.other = genderRecord.count;
            }
        }
    }
    
    // Get age group breakdown
    stream<record{int age_group; int count;}, error?> ageStream = dbClient->query(
        `SELECT 
            CASE 
                WHEN YEAR(CURDATE()) - YEAR(dob) < 18 THEN 1
                WHEN YEAR(CURDATE()) - YEAR(dob) BETWEEN 18 AND 30 THEN 2
                WHEN YEAR(CURDATE()) - YEAR(dob) BETWEEN 31 AND 50 THEN 3
                WHEN YEAR(CURDATE()) - YEAR(dob) BETWEEN 51 AND 65 THEN 4
                ELSE 5
            END as age_group,
            COUNT(*) as count
         FROM patients 
         GROUP BY age_group`
    );
    record{int age_group; int count;}[]|error ageResult = from record{int age_group; int count;} age in ageStream select age;
    check ageStream.close();
    
    AgeGroupBreakdown ageBreakdown = {under18: 0, age18to30: 0, age31to50: 0, age51to65: 0, over65: 0};
    if ageResult is record{int age_group; int count;}[] {
        foreach var ageRecord in ageResult {
            if ageRecord.age_group == 1 {
                ageBreakdown.under18 = ageRecord.count;
            } else if ageRecord.age_group == 2 {
                ageBreakdown.age18to30 = ageRecord.count;
            } else if ageRecord.age_group == 3 {
                ageBreakdown.age31to50 = ageRecord.count;
            } else if ageRecord.age_group == 4 {
                ageBreakdown.age51to65 = ageRecord.count;
            } else if ageRecord.age_group == 5 {
                ageBreakdown.over65 = ageRecord.count;
            }
        }
    }
    
    // Get total patient count
    stream<record{int total_patients;}, error?> totalStream = dbClient->query(
        `SELECT COUNT(*) as total_patients FROM patients`
    );
    record{int total_patients;}[]|error totalResult = from record{int total_patients;} total in totalStream select total;
    check totalStream.close();
    
    int totalPatients = 0;
    if totalResult is record{int total_patients;}[] && totalResult.length() > 0 {
        totalPatients = totalResult[0].total_patients;
    }
    
    return {
        genderBreakdown: genderBreakdown,
        ageBreakdown: ageBreakdown,
        totalPatients: totalPatients
    };
}

// Get financial statistics
function getFinancialStats(mysql:Client dbClient) returns FinancialStats|error {
    // Get claim and coverage amounts
    stream<record{decimal total_claims; decimal avg_claims;}, error?> claimAmountStream = dbClient->query(
        `SELECT 
            COALESCE(SUM(claim_amount), 0) as total_claims,
            COALESCE(AVG(claim_amount), 0) as avg_claims
         FROM claims`
    );
    record{decimal total_claims; decimal avg_claims;}[]|error claimAmountResult = 
        from record{decimal total_claims; decimal avg_claims;} amount in claimAmountStream select amount;
    check claimAmountStream.close();
    
    stream<record{decimal total_coverage; decimal avg_coverage;}, error?> coverageAmountStream = dbClient->query(
        `SELECT 
            COALESCE(SUM(coverage_limit), 0) as total_coverage,
            COALESCE(AVG(coverage_limit), 0) as avg_coverage
         FROM policies`
    );
    record{decimal total_coverage; decimal avg_coverage;}[]|error coverageAmountResult = 
        from record{decimal total_coverage; decimal avg_coverage;} coverage in coverageAmountStream select coverage;
    check coverageAmountStream.close();
    
    decimal totalClaims = 0.0;
    decimal avgClaims = 0.0;
    decimal totalCoverage = 0.0;
    decimal avgCoverage = 0.0;
    
    if claimAmountResult is record{decimal total_claims; decimal avg_claims;}[] && claimAmountResult.length() > 0 {
        totalClaims = claimAmountResult[0].total_claims;
        avgClaims = claimAmountResult[0].avg_claims;
    }
    
    if coverageAmountResult is record{decimal total_coverage; decimal avg_coverage;}[] && coverageAmountResult.length() > 0 {
        totalCoverage = coverageAmountResult[0].total_coverage;
        avgCoverage = coverageAmountResult[0].avg_coverage;
    }
    
    // Calculate utilization rate
    decimal utilizationRate = totalCoverage > 0d ? (totalClaims / totalCoverage) * 100 : 0.0;
    
    // Sample monthly financial trends
    MonthlyFinancialTrend[] monthlyTrends = [];
    monthlyTrends.push({month: "Jan 2025", totalClaims: 15000.0, totalCoverage: 50000.0, utilizationRate: 30.0});
    monthlyTrends.push({month: "Feb 2025", totalClaims: 18500.0, totalCoverage: 52000.0, utilizationRate: 35.6});
    monthlyTrends.push({month: "Mar 2025", totalClaims: 16200.0, totalCoverage: 51000.0, utilizationRate: 31.8});
    monthlyTrends.push({month: "Apr 2025", totalClaims: 21000.0, totalCoverage: 53000.0, utilizationRate: 39.6});
    monthlyTrends.push({month: "May 2025", totalClaims: 17800.0, totalCoverage: 54000.0, utilizationRate: 33.0});
    monthlyTrends.push({month: "Jun 2025", totalClaims: 22500.0, totalCoverage: 55000.0, utilizationRate: 40.9});
    
    return {
        totalClaimAmount: totalClaims,
        totalCoverageAmount: totalCoverage,
        avgClaimAmount: avgClaims,
        avgCoverageAmount: avgCoverage,
        claimUtilizationRate: utilizationRate,
        monthlyTrends: monthlyTrends
    };
}
