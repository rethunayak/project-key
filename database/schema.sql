-- ====================================================================
-- Slope Safe: AI-Powered Landslide Early Warning & Risk Intelligence System
-- Smart India Hackathon (SIH 2026) | Problem Statement: SIH26001
-- Database Schema for MySQL 8.0+
-- ====================================================================

CREATE DATABASE IF NOT EXISTS slope_safe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE slope_safe_db;

-- 1. Historical & Monitored Landslide Events
DROP TABLE IF EXISTS landslide_events;
CREATE TABLE landslide_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    date DATE NOT NULL,
    rainfall DECIMAL(8, 2) NOT NULL COMMENT 'in mm (24h cumulative)',
    soil_moisture DECIMAL(5, 2) NOT NULL COMMENT 'in percentage (0-100)',
    slope DECIMAL(5, 2) NOT NULL COMMENT 'in degrees (0-90)',
    elevation INT NOT NULL COMMENT 'in meters above sea level',
    soil_type ENUM('clay', 'loam', 'silt', 'gravelly', 'sand') NOT NULL,
    severity ENUM('LOW', 'MODERATE', 'HIGH', 'CRITICAL') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_date (date),
    INDEX idx_severity (severity)
) ENGINE=InnoDB;

-- 2. AI Model Inferences and Predictions Log
DROP TABLE IF EXISTS predictions;
CREATE TABLE predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    rainfall DECIMAL(8, 2) NOT NULL,
    soil_moisture DECIMAL(5, 2) NOT NULL,
    slope DECIMAL(5, 2) NOT NULL,
    elevation INT NOT NULL,
    soil_type ENUM('clay', 'loam', 'silt', 'gravelly', 'sand') NOT NULL,
    previous_landslide TINYINT(1) NOT NULL DEFAULT 0,
    risk_score DECIMAL(5, 2) NOT NULL COMMENT 'Model probability 0.0 - 100.0',
    risk_level ENUM('LOW', 'MODERATE', 'HIGH', 'CRITICAL') NOT NULL,
    prediction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pred_location (location),
    INDEX idx_pred_risk (risk_level),
    INDEX idx_pred_time (prediction_time)
) ENGINE=InnoDB;

-- 3. Early Warning Alerts & Broadcasts
DROP TABLE IF EXISTS alerts;
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    risk_level ENUM('LOW', 'MODERATE', 'HIGH', 'CRITICAL') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('ACTIVE', 'SIMULATION', 'DISPATCHED', 'RESOLVED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_alert_status (status),
    INDEX idx_alert_level (risk_level)
) ENGINE=InnoDB;

-- 4. Ground Truth & Field Feedback Reports
DROP TABLE IF EXISTS field_reports;
CREATE TABLE field_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    report TEXT NOT NULL COMMENT 'Observations and ground context',
    actual_condition ENUM(
        'Landslide observed',
        'No landslide observed',
        'Minor movement',
        'Road blockage',
        'Soil cracking',
        'Other'
    ) NOT NULL,
    reported_by VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_report_condition (actual_condition),
    INDEX idx_report_date (date)
) ENGINE=InnoDB;

-- ====================================================================
-- Initial Demonstration & Calibration Seed Data (North Eastern Region)
-- ====================================================================

INSERT INTO landslide_events (location, latitude, longitude, date, rainfall, soil_moisture, slope, elevation, soil_type, severity) VALUES
('Kohima NH-29 Bypass', 25.6751000, 94.1086000, '2024-07-14', 195.50, 88.40, 43.50, 1440, 'clay', 'CRITICAL'),
('Gangtok - JN Road Sector', 27.3389000, 88.6065000, '2024-08-02', 178.00, 84.00, 39.00, 1650, 'gravelly', 'HIGH'),
('Aizawl Sairang Ridge', 23.7271000, 92.7176000, '2024-06-28', 145.00, 72.00, 32.00, 1130, 'loam', 'MODERATE'),
('Shillong Peak Slopes', 25.5788000, 91.8933000, '2024-09-05', 65.00, 48.00, 18.00, 1965, 'silt', 'LOW'),
('Champhai Border Highway', 23.4756000, 93.3283000, '2024-07-22', 188.00, 86.50, 45.00, 1675, 'clay', 'CRITICAL'),
('Guwahati Kamakhya Incline', 26.1664000, 91.7054000, '2024-08-19', 42.00, 38.00, 14.50, 320, 'sand', 'LOW'),
('Itanagar - Yupia Highway', 27.0844000, 93.6053000, '2024-07-09', 162.00, 79.50, 37.00, 750, 'gravelly', 'HIGH'),
('Dimapur Chumukedima Hill', 25.7925000, 93.7712000, '2024-08-11', 110.00, 64.00, 26.00, 410, 'loam', 'MODERATE');

INSERT INTO alerts (location, risk_level, message, status, created_at) VALUES
('Kohima NH-29 Bypass', 'CRITICAL', 'Heavy rainfall (195mm) + saturated soil (88%) on active fracture zone. Red Alert issued.', 'ACTIVE', NOW() - INTERVAL 45 MINUTE),
('Gangtok - JN Road Sector', 'HIGH', 'Continuous precipitation on steep incline. Border Roads Organisation alerted.', 'ACTIVE', NOW() - INTERVAL 3 HOUR),
('Aizawl Sairang Ridge', 'MODERATE', 'Elevated soil moisture post 48h rain spell. Routine surveillance ongoing.', 'ACTIVE', NOW() - INTERVAL 6 HOUR);

INSERT INTO field_reports (location, report, actual_condition, reported_by, date) VALUES
('Kohima NH-29 Bypass', 'Tension crack observed along road shoulder near KM 14. Seepage water surfacing.', 'Soil cracking', 'Er. T. Jamir (PWD Hills)', NOW() - INTERVAL 2 HOUR),
('Gangtok - JN Road Sector', 'Loose scree and small rockfall cleared by BRO dozer team. Single-lane movement active.', 'Minor movement', 'Capt. R. Sharma (BRO)', NOW() - INTERVAL 5 HOUR);
