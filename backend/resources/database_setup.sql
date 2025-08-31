-- Create the binary_bandits database
DROP DATABASE IF EXISTS binary_bandits;
CREATE DATABASE IF NOT EXISTS binary_bandits;
USE binary_bandits;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Create user sessions table for session token tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_jti (session_token),
    INDEX idx_expires_at (expires_at)
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    patient_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10),
    address VARCHAR(255)
);

-- Create insurers table
CREATE TABLE IF NOT EXISTS insurers (
    insurer_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
    provider_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50)
);

-- Create policies table
CREATE TABLE IF NOT EXISTS policies (
    policy_id VARCHAR(20) PRIMARY KEY,
    patient_id INT NOT NULL,
    insurer_id VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20),
    coverage_limit DECIMAL(12,2),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (insurer_id) REFERENCES insurers(insurer_id) ON DELETE CASCADE
);

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
    claim_id VARCHAR(20) PRIMARY KEY,
    patient_id INT NOT NULL,
    policy_id VARCHAR(20) NOT NULL,
    provider_id VARCHAR(20) NOT NULL,
    diagnosis_code VARCHAR(20),
    procedure_code VARCHAR(20),
    claim_amount DECIMAL(10,2),
    status VARCHAR(20),
    decision_reason VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id) ON DELETE CASCADE
);

-- Insert sample data into patients
INSERT INTO patients (patient_id, name, dob, gender, address) VALUES
(12345, 'John Doe', '1990-02-12', 'Male', '45 Main Street')
ON DUPLICATE KEY UPDATE patient_id=patient_id;

-- Insert sample data into insurers
INSERT INTO insurers (insurer_id, name) VALUES
('INS001', 'LifeHealth Inc.')
ON DUPLICATE KEY UPDATE insurer_id=insurer_id;

-- Insert sample data into providers
INSERT INTO providers (provider_id, name, type) VALUES
('DR567', 'Dr. Smith', 'Doctor'),
('HOSP001', 'City Hospital', 'Hospital')
ON DUPLICATE KEY UPDATE provider_id=provider_id;

-- Insert sample data into policies
INSERT INTO policies (policy_id, patient_id, insurer_id, start_date, end_date, status, coverage_limit) VALUES
('POLICY123', 12345, 'INS001', '2024-01-01', '2025-01-01', 'Active', 10000)
ON DUPLICATE KEY UPDATE policy_id=policy_id;

-- Insert sample data into claims
INSERT INTO claims (claim_id, patient_id, policy_id, provider_id, diagnosis_code, procedure_code, claim_amount, status, decision_reason) VALUES
('claim123', 12345, 'POLICY123', 'DR567', 'D123', 'PROC456', 200, 'Approved', 'Within coverage limit')
ON DUPLICATE KEY UPDATE claim_id=claim_id;

-- Insert sample users for testing (password is "password123" hashed with SHA256)
INSERT INTO users (username, email, password_hash, full_name) VALUES 
('admin', 'admin@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'System Administrator'),
('testuser', 'test@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Test User')
ON DUPLICATE KEY UPDATE id=id;

-- Add indexes for better claim processing performance
ALTER TABLE claims ADD INDEX idx_patient_id (patient_id);
ALTER TABLE claims ADD INDEX idx_policy_id (policy_id);
ALTER TABLE claims ADD INDEX idx_provider_id (provider_id);
ALTER TABLE claims ADD INDEX idx_status (status);

-- Insert additional sample data for testing
INSERT INTO claims (claim_id, patient_id, policy_id, provider_id, diagnosis_code, procedure_code, claim_amount, status, decision_reason) VALUES
('claim456', 12345, 'POLICY123', 'HOSP001', 'D456', 'PROC789', 1500, 'Pending', 'Under review'),
('claim789', 12345, 'POLICY123', 'DR567', 'D789', 'PROC012', 8000, 'Pending', 'Requires manual review')
ON DUPLICATE KEY UPDATE claim_id=claim_id;

-- Show the created tables
SHOW TABLES;
SELECT COUNT(*) as user_count FROM users;

-- Show updated table structure and data
DESCRIBE claims;
SELECT * FROM claims;
