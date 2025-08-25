// =============================================================================
// DATA MODELS FOR INSURANCE CLAIM AUDIT DASHBOARD
// =============================================================================
// This file contains all the data types used throughout the backend
// These match the database schema and frontend expectations

// Import will be handled after dependencies are built

// =============================================================================
// CORE CLAIM ENTITY
// =============================================================================
// Represents a single insurance claim with all its details
public type Claim record {
    // Primary identifier for the claim (e.g., "CLM-47291")
    string id;
    
    // When the claim was submitted (ISO 8601 format)
    string submission_date;
    
    // Monetary value of the claim in decimal format
    decimal amount;
    
    // Risk assessment level: "low", "medium", "high", "critical"
    string risk_level;
    
    // Current processing status: "pending", "in_review", "approved", "rejected"
    string status;
    
    // Type of claim: "Medical", "Dental", "Vision", "Prescription", etc.
    string claim_type;
    
    // Name of the assigned reviewer (optional, can be "Unassigned")
    string? reviewer;
    
    // ID of the user who submitted the claim
    string submitter_id;
    
    // Detailed description of the claim
    string description;
    
    // Date when the incident occurred
    string incident_date;
    
    // Location where the incident/service occurred (optional)
    string? location;
    
    // Auto-generated timestamp when record was created
    string created_at;
    
    // Auto-generated timestamp when record was last updated
    string updated_at;
};

// =============================================================================
// FRAUD ALERT ENTITY
// =============================================================================
// Represents a fraud detection alert for suspicious claims
public type FraudAlert record {
    // Unique identifier for the alert (e.g., "ALERT-001")
    string id;
    
    // Reference to the claim that triggered this alert
    string claim_id;
    
    // Human-readable message describing the suspected fraud
    string message;
    
    // Alert severity: "high" or "critical"
    string priority;
    
    // When the alert was generated
    string timestamp;
    
    // Whether the alert has been dismissed by a reviewer (0 = active, 1 = dismissed)
    int dismissed;
    
    // When the alert record was created
    string created_at;
};

// =============================================================================
// DASHBOARD STATISTICS
// =============================================================================
// Aggregated statistics for the main dashboard display
public type DashboardStats record {
    // Key Performance Indicators section
    KPIStats kpi_stats;
    
    // Chart data for visualizations
    ChartData chart_data;
    
    // When these statistics were last calculated
    string last_updated;
};

// =============================================================================
// KEY PERFORMANCE INDICATORS (KPIs)
// =============================================================================
// The four main metrics displayed in the dashboard cards
public type KPIStats record {
    // Total number of claims processed this month
    TotalClaimsKPI total_claims;
    
    // Number of fraud cases detected
    FraudDetectedKPI fraud_detected;
    
    // Average time to process claims
    ProcessingTimeKPI processing_time;
    
    // AI model accuracy percentage
    AccuracyRateKPI accuracy_rate;
};

// Individual KPI structure with value, change, and description
public type TotalClaimsKPI record {
    int value;                    // e.g., 1247
    string change;               // e.g., "+12%"
    string description;          // Explanatory text
    boolean is_improvement;      // Whether the change is positive
};

public type FraudDetectedKPI record {
    int value;                   // e.g., 23
    string change;              // e.g., "-8%"
    string description;         // Explanatory text
    boolean is_improvement;     // Lower fraud is better, so -8% is good
};

public type ProcessingTimeKPI record {
    decimal value;              // e.g., 2.3 (days)
    string change;             // e.g., "-15%"
    string description;        // Explanatory text
    boolean is_improvement;    // Faster processing is better
};

public type AccuracyRateKPI record {
    decimal value;             // e.g., 98.5 (percentage)
    string change;            // e.g., "+2.1%"
    string description;       // Explanatory text
    boolean is_improvement;   // Higher accuracy is better
};

// =============================================================================
// CHART DATA STRUCTURES
// =============================================================================
// Data structures for the various charts displayed on the dashboard
public type ChartData record {
    // Data for the monthly trends area chart
    MonthlyData[] monthly_trends;
    
    // Data for the risk distribution pie chart
    RiskDistribution[] risk_distribution;
    
    // Data for the performance metrics line chart
    PerformanceData[] performance_over_time;
    
    // Data for the fraud detection by category bar chart
    CategoryData[] fraud_by_category;
};

// Monthly claims and fraud data for trend analysis
public type MonthlyData record {
    string month;              // "Jan", "Feb", etc.
    int claims;               // Number of claims that month
    int fraud;                // Number of fraud cases that month
};

// Risk level distribution for pie chart
public type RiskDistribution record {
    string risk_level;        // "Low Risk", "Medium Risk", "High Risk"
    int percentage;           // Percentage of total claims
    string color;            // Hex color for chart display
};

// Performance metrics over time for line chart
public type PerformanceData record {
    string month;            // "Jan", "Feb", etc.
    decimal accuracy;        // Accuracy percentage for that month
    decimal response_score;  // Response time score (0-100)
};

// Fraud detection by category for bar chart
public type CategoryData record {
    string category;         // "Identity", "Billing", "Provider", etc.
    int count;              // Number of fraud cases in this category
};

// =============================================================================
// API RESPONSE WRAPPERS
// =============================================================================
// Standard response formats for API endpoints

// Generic success response
public type SuccessResponse record {
    boolean success;
    string message;
    anydata data?;
};

// Generic error response
public type ErrorResponse record {
    boolean success;
    string message;
    string error_code?;
};

// Paginated response for claims list
public type ClaimsListResponse record {
    boolean success;
    Claim[] claims;
    int total_count;
    int page;
    int page_size;
    boolean has_next_page;
};

// =============================================================================
// DATABASE RECORD TYPES
// =============================================================================
// These types map directly to database table structures

// Database record type for claims table
public type ClaimRecord record {|
    string id;
    string submission_date;
    decimal amount;
    string risk_level;
    string status;
    string claim_type;
    string? reviewer;
    string submitter_id;
    string description;
    string incident_date;
    string? location;
    string created_at;
    string updated_at;
|};

// Database record type for fraud_alerts table
public type FraudAlertRecord record {|
    string id;
    string claim_id;
    string message;
    string priority;
    string timestamp;
    int dismissed;
    string created_at;
|};

// =============================================================================
// QUERY FILTER TYPES
// =============================================================================
// Types for filtering and searching data

// Filters for claims list endpoint
public type ClaimFilters record {
    string? status;          // Filter by status
    string? risk_level;      // Filter by risk level
    string? claim_type;      // Filter by claim type
    string? reviewer;        // Filter by assigned reviewer
    string? date_from;       // Filter claims after this date
    string? date_to;         // Filter claims before this date
    decimal? min_amount;     // Filter claims above this amount
    decimal? max_amount;     // Filter claims below this amount
};

// Pagination parameters
public type PaginationParams record {
    int page;               // Page number (1-based)
    int page_size;          // Number of items per page
    string? sort_by;        // Field to sort by
    string? sort_order;     // "asc" or "desc"
};
