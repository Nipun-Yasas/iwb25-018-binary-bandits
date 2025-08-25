-- Insurance Audit Database Setup Script
-- Run this script in MySQL to set up the database

-- Create database
CREATE DATABASE IF NOT EXISTS insurance_audit;
USE insurance_audit;

-- Create user for the application (optional - you can use root for testing)
-- CREATE USER IF NOT EXISTS 'audit_user'@'localhost' IDENTIFIED BY 'audit_password';
-- GRANT ALL PRIVILEGES ON insurance_audit.* TO 'audit_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Create tables
CREATE TABLE IF NOT EXISTS claims (
    id VARCHAR(50) PRIMARY KEY,
    submission_date DATETIME,
    amount DECIMAL(10,2),
    risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
    status ENUM('pending', 'in_review', 'approved', 'rejected') DEFAULT 'pending',
    claim_type VARCHAR(100),
    reviewer VARCHAR(100),
    submitter_id VARCHAR(50),
    description TEXT,
    incident_date DATE,
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fraud_alerts (
    id VARCHAR(50) PRIMARY KEY,
    claim_id VARCHAR(50),
    message TEXT,
    priority ENUM('high', 'critical') DEFAULT 'high',
    timestamp DATETIME,
    dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
);

-- Insert sample data for testing
INSERT IGNORE INTO claims (id, submission_date, amount, risk_level, status, claim_type, reviewer, submitter_id, description, incident_date, location) VALUES
('CLM-47291', '2025-08-15 10:30:00', 2450.75, 'high', 'in_review', 'Medical', 'Sarah Johnson', 'USR-001', 'Emergency room visit after car accident', '2025-08-14', 'Downtown Medical Center'),
('CLM-47285', '2025-08-14 14:20:00', 890.50, 'low', 'approved', 'Dental', 'Michael Chen', 'USR-002', 'Routine dental cleaning and checkup', '2025-08-13', 'City Dental Clinic'),
('CLM-47278', '2025-08-13 09:15:00', 5200.00, 'medium', 'pending', 'Medical', 'Unassigned', 'USR-003', 'MRI scan for back pain diagnosis', '2025-08-12', 'Regional Imaging Center'),
('CLM-47269', '2025-08-12 16:45:00', 1735.25, 'low', 'approved', 'Vision', 'Lisa Thompson', 'USR-004', 'Eye examination and prescription glasses', '2025-08-11', 'Vision Care Associates'),
('CLM-47258', '2025-08-11 11:30:00', 12850.75, 'critical', 'rejected', 'Surgery', 'David Wilson', 'USR-005', 'Elective cosmetic surgery procedure', '2025-08-10', 'Premium Surgery Center'),
('CLM-47254', '2025-08-10 13:20:00', 450.00, 'low', 'approved', 'Prescription', 'Michael Chen', 'USR-006', 'Monthly prescription medication refill', '2025-08-09', 'City Pharmacy');

-- Insert sample fraud alerts
INSERT IGNORE INTO fraud_alerts (id, claim_id, message, priority, timestamp, dismissed) VALUES
('ALERT-001', 'CLM-47291', 'Critical alert: Unusual activity detected in claim #CLM-47291. High fraud probability score.', 'critical', '2025-08-15 11:00:00', FALSE),
('ALERT-002', 'CLM-47258', 'High risk: Multiple claims from same location in short timeframe.', 'high', '2025-08-11 12:00:00', FALSE);

-- Show created tables
SHOW TABLES;

-- Show sample data
SELECT 'Claims Table:' as info;
SELECT * FROM claims LIMIT 5;

SELECT 'Fraud Alerts Table:' as info;
SELECT * FROM fraud_alerts;

SELECT 'Database setup completed successfully!' as status;
