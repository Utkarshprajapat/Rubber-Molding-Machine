-- Cloud deployment version, DB selected via CLI

CREATE TABLE IF NOT EXISTS machines (
  machine_id INT PRIMARY KEY AUTO_INCREMENT,
  machine_name VARCHAR(100) NOT NULL,
  machine_type VARCHAR(100) DEFAULT '4-Pillar Compression',
  location VARCHAR(100),
  status ENUM('ACTIVE','INACTIVE','MAINTENANCE') DEFAULT 'ACTIVE',
  installation_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS operators (
  operator_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  employee_code VARCHAR(20) UNIQUE,
  shift ENUM('MORNING','AFTERNOON','NIGHT'),
  contact VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensor_readings (
  reading_id INT PRIMARY KEY AUTO_INCREMENT,
  machine_id INT NOT NULL,
  temperature DECIMAL(6,2),
  pressure DECIMAL(6,2),
  clamp_force DECIMAL(6,2),
  cycle_time DECIMAL(6,2),
  quality_score DECIMAL(5,2),
  defect_probability DECIMAL(5,2),
  cure_status ENUM('CURING','COOLING','IDLE') DEFAULT 'CURING',
  machine_status ENUM('STABLE','WARNING','FAULT') DEFAULT 'STABLE',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (machine_id) REFERENCES machines(machine_id)
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  record_id INT PRIMARY KEY AUTO_INCREMENT,
  machine_id INT NOT NULL,
  operator_id INT,
  maintenance_type ENUM('ROUTINE','CORRECTIVE','PREVENTIVE'),
  description TEXT,
  status ENUM('SCHEDULED','IN_PROGRESS','COMPLETED'),
  scheduled_date DATE,
  completed_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (machine_id) REFERENCES machines(machine_id),
  FOREIGN KEY (operator_id) REFERENCES operators(operator_id)
);

CREATE TABLE IF NOT EXISTS alerts (
  alert_id INT PRIMARY KEY AUTO_INCREMENT,
  machine_id INT NOT NULL,
  alert_type VARCHAR(50),
  message TEXT,
  severity ENUM('LOW','MEDIUM','HIGH','CRITICAL'),
  is_resolved BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (machine_id) REFERENCES machines(machine_id)
);

-- Insert sample hardware/machines
INSERT INTO machines (machine_name, location, installation_date) VALUES 
('Machine-01', 'Floor 1 - Zone A', '2023-01-15'),
('Machine-02', 'Floor 1 - Zone B', '2023-03-20'),
('Machine-03', 'Floor 2 - Zone A', '2023-06-10');

-- Insert operators
INSERT INTO operators (name, employee_code, shift, contact) VALUES
('John Doe', 'EMP001', 'MORNING', '555-0101'),
('Jane Smith', 'EMP002', 'AFTERNOON', '555-0102'),
('Mike Johnson', 'EMP003', 'NIGHT', '555-0103'),
('Emily Davis', 'EMP004', 'MORNING', '555-0104'),
('Robert Brown', 'EMP005', 'AFTERNOON', '555-0105');

-- Insert sensor readings
INSERT INTO sensor_readings (machine_id, temperature, pressure, clamp_force, cycle_time, quality_score, defect_probability, cure_status, machine_status) VALUES
(1, 185.50, 100.20, 200.50, 45.0, 95.50, 2.50, 'CURING', 'STABLE'),
(2, 190.10, 105.00, 201.00, 46.2, 94.00, 3.00, 'CURING', 'STABLE'),
(3, 175.80, 95.50, 195.00, 44.5, 96.00, 4.10, 'COOLING', 'STABLE'),
(1, 186.00, 101.00, 200.00, 45.1, 95.00, 2.60, 'CURING', 'STABLE'),
(2, 196.50, 108.50, 202.00, 47.0, 88.00, 8.50, 'CURING', 'WARNING'),
(3, 175.50, 95.00, 194.50, 44.8, 96.50, 3.80, 'COOLING', 'STABLE'),
(1, 185.00, 100.00, 201.00, 45.0, 95.80, 2.40, 'CURING', 'STABLE'),
(2, 205.00, 116.00, 205.00, 48.5, 75.00, 18.50, 'CURING', 'FAULT'),
(3, 174.00, 94.00, 195.50, 44.2, 97.00, 3.50, 'IDLE', 'STABLE'),
(1, 184.50, 99.50, 200.50, 45.2, 95.20, 2.70, 'CURING', 'STABLE'),
(2, 198.00, 112.00, 203.00, 47.5, 85.00, 10.00, 'CURING', 'WARNING'),
(3, 170.00, 90.00, 190.00, 40.0, 98.00, 2.00, 'IDLE', 'STABLE'),
(1, 185.20, 100.50, 200.20, 45.1, 95.40, 2.50, 'CURING', 'STABLE'),
(2, 190.00, 105.00, 199.00, 46.0, 93.00, 4.00, 'CURING', 'STABLE'),
(3, 176.00, 96.00, 196.00, 45.0, 95.00, 4.50, 'CURING', 'STABLE'),
(1, 186.50, 102.00, 201.50, 45.5, 94.50, 3.00, 'CURING', 'STABLE'),
(2, 191.00, 106.00, 200.00, 46.5, 92.50, 4.50, 'CURING', 'STABLE'),
(3, 177.00, 97.00, 197.00, 45.5, 94.00, 5.00, 'CURING', 'STABLE'),
(1, 187.00, 103.00, 202.00, 46.0, 93.50, 3.50, 'COOLING', 'STABLE'),
(2, 192.00, 107.00, 201.00, 47.0, 91.50, 5.00, 'COOLING', 'STABLE'),
(3, 178.00, 98.00, 198.00, 46.0, 93.00, 5.50, 'COOLING', 'STABLE'),
(1, 187.50, 104.00, 202.50, 46.5, 92.50, 4.00, 'COOLING', 'STABLE'),
(2, 193.00, 108.00, 202.00, 47.5, 90.50, 5.50, 'IDLE', 'STABLE'),
(3, 179.00, 99.00, 199.00, 46.5, 92.00, 6.00, 'IDLE', 'STABLE'),
(1, 188.00, 105.00, 203.00, 47.0, 91.50, 4.50, 'IDLE', 'STABLE');

-- Insert maintenance records
INSERT INTO maintenance_records (machine_id, operator_id, maintenance_type, description, status, scheduled_date) VALUES
(1, 1, 'ROUTINE', 'Regular oil change and lubrication', 'COMPLETED', '2023-08-01'),
(2, 2, 'PREVENTIVE', 'Sensor recalibration', 'IN_PROGRESS', '2023-11-15'),
(3, 3, 'CORRECTIVE', 'Replace faulty heating element', 'SCHEDULED', '2024-01-10'),
(1, 4, 'ROUTINE', 'Visual inspection and cleaning', 'COMPLETED', '2023-09-01'),
(2, 5, 'PREVENTIVE', 'Hydraulic system check', 'SCHEDULED', '2024-02-05');

-- Insert alerts
INSERT INTO alerts (machine_id, alert_type, message, severity, is_resolved) VALUES
(2, 'HIGH_TEMPERATURE', 'Machine temperature exceeded 200°C', 'CRITICAL', FALSE),
(2, 'HIGH_PRESSURE', 'Machine pressure exceeded 110 psi', 'HIGH', TRUE),
(1, 'MAINTENANCE_DUE', 'Routine maintenance is due in 3 days', 'MEDIUM', FALSE);
