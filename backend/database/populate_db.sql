-- Cloud deployment version, DB selected via CLI

-- STEP 1: Insert Machines
INSERT INTO machines (machine_name, machine_type, location, status, installation_date) VALUES
('Machine-04', '4-Pillar Compression', 'Unit A', 'ACTIVE', '2022-03-15'),
('Machine-05', '4-Pillar Compression', 'Unit A', 'ACTIVE', '2022-04-20'),
('Machine-06', '4-Pillar Compression', 'Unit B', 'ACTIVE', '2022-05-10'),
('Machine-07', '4-Pillar Compression', 'Unit B', 'MAINTENANCE', '2021-11-05'),
('Machine-08', '4-Pillar Compression', 'Unit C', 'ACTIVE', '2023-01-18'),
('Machine-09', '4-Pillar Compression', 'Unit C', 'ACTIVE', '2023-02-22'),
('Machine-10', '4-Pillar Compression', 'Unit D', 'INACTIVE', '2020-08-30'),
('Machine-11', '4-Pillar Compression', 'Unit D', 'ACTIVE', '2023-06-14'),
('Machine-12', '4-Pillar Compression', 'Unit A', 'ACTIVE', '2023-07-19'),
('Machine-13', '4-Pillar Compression', 'Unit B', 'ACTIVE', '2022-09-25'),
('Machine-14', '4-Pillar Compression', 'Unit C', 'MAINTENANCE', '2021-12-01'),
('Machine-15', '4-Pillar Compression', 'Unit D', 'ACTIVE', '2023-03-08'),
('Machine-16', '4-Pillar Compression', 'Unit A', 'ACTIVE', '2022-10-17'),
('Machine-17', '4-Pillar Compression', 'Unit B', 'ACTIVE', '2023-08-05'),
('Machine-18', '4-Pillar Compression', 'Unit C', 'INACTIVE', '2020-05-12'),
('Machine-19', '4-Pillar Compression', 'Unit D', 'ACTIVE', '2023-09-30'),
('Machine-20', '4-Pillar Compression', 'Unit A', 'ACTIVE', '2023-10-11');

-- STEP 2: Insert Operators
INSERT INTO operators (name, employee_code, shift, contact) VALUES
('Ramesh Kumar', 'EMP006', 'MORNING', '9876543216'),
('Suresh Patel', 'EMP007', 'AFTERNOON', '9876543217'),
('Mahesh Singh', 'EMP008', 'NIGHT', '9876543218'),
('Dinesh Verma', 'EMP009', 'MORNING', '9876543219'),
('Rajesh Sharma', 'EMP010', 'AFTERNOON', '9876543220'),
('Anil Gupta', 'EMP011', 'NIGHT', '9876543221'),
('Vijay Yadav', 'EMP012', 'MORNING', '9876543222'),
('Prakash Joshi', 'EMP013', 'AFTERNOON', '9876543223'),
('Santosh Mishra', 'EMP014', 'NIGHT', '9876543224'),
('Deepak Tiwari', 'EMP015', 'MORNING', '9876543225'),
('Ashok Pandey', 'EMP016', 'AFTERNOON', '9876543226'),
('Sanjay Dubey', 'EMP017', 'NIGHT', '9876543227'),
('Manoj Tripathi', 'EMP018', 'MORNING', '9876543228'),
('Pradeep Chauhan', 'EMP019', 'AFTERNOON', '9876543229'),
('Vinod Saxena', 'EMP020', 'NIGHT', '9876543230');

-- STEP 3: Insert Maintenance Records
-- (Excluding the truncated record at the end)
INSERT INTO maintenance_records 
(machine_id, operator_id, maintenance_type, description, status, scheduled_date, completed_date) VALUES
(1, 1, 'ROUTINE', 'Monthly lubrication and inspection', 'COMPLETED', '2024-01-10', '2024-01-10'),
(2, 2, 'PREVENTIVE', 'Hydraulic system pressure check', 'COMPLETED', '2024-01-15', '2024-01-16'),
(3, 3, 'CORRECTIVE', 'Temperature sensor replacement', 'COMPLETED', '2024-01-20', '2024-01-21'),
(4, 4, 'ROUTINE', 'Pillar alignment verification', 'COMPLETED', '2024-02-05', '2024-02-05'),
(5, 5, 'PREVENTIVE', 'Mold cavity cleaning and polishing', 'COMPLETED', '2024-02-10', '2024-02-11'),
(1, 6, 'CORRECTIVE', 'Pressure valve repair', 'COMPLETED', '2024-02-18', '2024-02-19'),
(2, 7, 'ROUTINE', 'Quarterly full system inspection', 'COMPLETED', '2024-03-01', '2024-03-01'),
(3, 8, 'PREVENTIVE', 'Cooling system flush and refill', 'COMPLETED', '2024-03-12', '2024-03-13'),
(4, 9, 'CORRECTIVE', 'Clamp force calibration', 'IN_PROGRESS', '2024-03-20', NULL),
(5, 10, 'ROUTINE', 'Belt and chain tension check', 'SCHEDULED', '2024-04-01', NULL),
(1, 11, 'PREVENTIVE', 'Electrical panel inspection', 'SCHEDULED', '2024-04-05', NULL),
(2, 12, 'ROUTINE', 'Oil change and filter replacement', 'SCHEDULED', '2024-04-10', NULL),
(3, 13, 'CORRECTIVE', 'Defective pressure gauge replacement', 'IN_PROGRESS', '2024-04-15', NULL);
