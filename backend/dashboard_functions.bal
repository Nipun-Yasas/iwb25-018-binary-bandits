// ==========================================================================
// DASHBOARD FUNCTIONS MODULE - Dashboard Statistics Business Logic
// ==========================================================================

import ballerina/log;
import ballerina/sql;
import ballerina/time;
import ballerinax/mysql;

// Get claims statistics by status
public function getClaimsStatsByStatus(mysql:Client dbClient) returns json|error {
    log:printInfo("📊 Calculating claims statistics by status");
    
    sql:ParameterizedQuery query = `SELECT status, COUNT(*) as count, SUM(amount) as total_amount 
                                   FROM claims 
                                   GROUP BY status`;
    
    stream<record {string status; int count; decimal total_amount;}, error?> statusStream = dbClient->query(query);
    record {|record {string status; int count; decimal total_amount;} value;|}|error? statusResult = statusStream.next();
    
    json[] statusStats = [];
    while statusResult is record {|record {string status; int count; decimal total_amount;} value;|} {
        statusStats.push({
            "status": statusResult.value.status,
            "count": statusResult.value.count,
            "total_amount": statusResult.value.total_amount
        });
        statusResult = statusStream.next();
    }
    check statusStream.close();
    
    return {"by_status": statusStats};
}

// Get claims statistics by risk level
public function getClaimsStatsByRisk(mysql:Client dbClient) returns json|error {
    log:printInfo("📊 Calculating claims statistics by risk level");
    
    sql:ParameterizedQuery query = `SELECT risk_level, COUNT(*) as count, AVG(amount) as average_amount 
                                   FROM claims 
                                   GROUP BY risk_level`;
    
    stream<record {string risk_level; int count; decimal average_amount;}, error?> riskStream = dbClient->query(query);
    record {|record {string risk_level; int count; decimal average_amount;} value;|}|error? riskResult = riskStream.next();
    
    json[] riskStats = [];
    while riskResult is record {|record {string risk_level; int count; decimal average_amount;} value;|} {
        riskStats.push({
            "risk_level": riskResult.value.risk_level,
            "count": riskResult.value.count,
            "average_amount": riskResult.value.average_amount
        });
        riskResult = riskStream.next();
    }
    check riskStream.close();
    
    return {"by_risk_level": riskStats};
}

// Get fraud alert statistics
public function getFraudAlertStats(mysql:Client dbClient) returns json|error {
    log:printInfo("📊 Calculating fraud alert statistics");
    
    sql:ParameterizedQuery query = `SELECT priority, COUNT(*) as count, 
                                           SUM(CASE WHEN dismissed = 0 THEN 1 ELSE 0 END) as active_count
                                   FROM fraud_alerts 
                                   GROUP BY priority`;
    
    stream<record {string priority; int count; int active_count;}, error?> alertStream = dbClient->query(query);
    record {|record {string priority; int count; int active_count;} value;|}|error? alertResult = alertStream.next();
    
    json[] alertStats = [];
    while alertResult is record {|record {string priority; int count; int active_count;} value;|} {
        alertStats.push({
            "priority": alertResult.value.priority,
            "total_count": alertResult.value.count,
            "active_count": alertResult.value.active_count
        });
        alertResult = alertStream.next();
    }
    check alertStream.close();
    
    return {"by_priority": alertStats};
}

// Get financial analytics
public function getFinancialAnalytics(mysql:Client dbClient) returns json|error {
    log:printInfo("📊 Calculating financial analytics");
    
    sql:ParameterizedQuery query = `SELECT 
                                       COUNT(*) as total_claims,
                                       SUM(amount) as total_amount,
                                       AVG(amount) as average_amount,
                                       SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as approved_amount,
                                       SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count
                                   FROM claims`;
    
    stream<record {int total_claims; decimal total_amount; decimal average_amount; decimal approved_amount; int approved_count;}, error?> finStream = dbClient->query(query);
    record {|record {int total_claims; decimal total_amount; decimal average_amount; decimal approved_amount; int approved_count;} value;|}|error? finResult = finStream.next();
    check finStream.close();
    
    if finResult is record {|record {int total_claims; decimal total_amount; decimal average_amount; decimal approved_amount; int approved_count;} value;|} {
        decimal approvalRate = finResult.value.total_claims > 0 ? 
            <decimal>finResult.value.approved_count / <decimal>finResult.value.total_claims * 100 : 0;
        
        return {
            "total_claims": finResult.value.total_claims,
            "total_amount": finResult.value.total_amount,
            "average_amount": finResult.value.average_amount,
            "approved_amount": finResult.value.approved_amount,
            "approved_count": finResult.value.approved_count,
            "approval_rate_percentage": approvalRate
        };
    }
    
    return error("Failed to calculate financial analytics");
}

// Get recent activity summary
public function getRecentActivity(mysql:Client dbClient) returns json|error {
    log:printInfo("📊 Calculating recent activity statistics");
    
    sql:ParameterizedQuery recentClaimsQuery = `SELECT COUNT(*) as recent_claims_count 
                                               FROM claims 
                                               WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
    
    stream<record {int recent_claims_count;}, error?> claimsStream = dbClient->query(recentClaimsQuery);
    record {|record {int recent_claims_count;} value;|}|error? claimsResult = claimsStream.next();
    check claimsStream.close();
    
    sql:ParameterizedQuery recentFraudQuery = `SELECT COUNT(*) as recent_fraud_count 
                                              FROM fraud_alerts 
                                              WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
    
    stream<record {int recent_fraud_count;}, error?> fraudStream = dbClient->query(recentFraudQuery);
    record {|record {int recent_fraud_count;} value;|}|error? fraudResult = fraudStream.next();
    check fraudStream.close();
    
    if claimsResult is record {|record {int recent_claims_count;} value;|} && fraudResult is record {|record {int recent_fraud_count;} value;|} {
        return {
            "recent_claims_30_days": claimsResult.value.recent_claims_count,
            "recent_fraud_alerts_30_days": fraudResult.value.recent_fraud_count,
            "period": "Last 30 days"
        };
    }
    
    return error("Failed to calculate recent activity");
}

// Get comprehensive dashboard statistics
public function getDashboardStatistics(mysql:Client dbClient) returns json|error {
    log:printInfo("📊 Generating comprehensive dashboard statistics...");
    
    // Get all statistics
    json|error claimsStatusStats = getClaimsStatsByStatus(dbClient);
    json|error claimsRiskStats = getClaimsStatsByRisk(dbClient);
    json|error fraudStats = getFraudAlertStats(dbClient);
    json|error financialStats = getFinancialAnalytics(dbClient);
    json|error recentActivity = getRecentActivity(dbClient);
    
    // Get basic counts
    sql:ParameterizedQuery claimsCountQuery = `SELECT COUNT(*) as count FROM claims`;
    stream<record {int count;}, error?> claimsCountStream = dbClient->query(claimsCountQuery);
    record {|record {int count;} value;|}|error? claimsCountResult = claimsCountStream.next();
    check claimsCountStream.close();
    
    sql:ParameterizedQuery fraudCountQuery = `SELECT COUNT(*) as count FROM fraud_alerts`;
    stream<record {int count;}, error?> fraudCountStream = dbClient->query(fraudCountQuery);
    record {|record {int count;} value;|}|error? fraudCountResult = fraudCountStream.next();
    check fraudCountStream.close();
    
    json response = {
        "summary": {
            "total_claims": claimsCountResult is record {|record {int count;} value;|} ? claimsCountResult.value.count : 0,
            "total_fraud_alerts": fraudCountResult is record {|record {int count;} value;|} ? fraudCountResult.value.count : 0,
            "generated_at": time:utcNow().toString(),
            "status": "✅ Live dashboard data"
        }
    };
    
    // Add successful statistics
    if claimsStatusStats is json {
        map<json> responseMap = <map<json>>response;
        responseMap["claims_by_status"] = claimsStatusStats;
        response = responseMap;
    }
    
    if claimsRiskStats is json {
        map<json> responseMap = <map<json>>response;
        responseMap["claims_by_risk"] = claimsRiskStats;
        response = responseMap;
    }
    
    if fraudStats is json {
        map<json> responseMap = <map<json>>response;
        responseMap["fraud_alerts"] = fraudStats;
        response = responseMap;
    }
    
    if financialStats is json {
        map<json> responseMap = <map<json>>response;
        responseMap["financial_analytics"] = financialStats;
        response = responseMap;
    }
    
    if recentActivity is json {
        map<json> responseMap = <map<json>>response;
        responseMap["recent_activity"] = recentActivity;
        response = responseMap;
    }
    
    return response;
}
