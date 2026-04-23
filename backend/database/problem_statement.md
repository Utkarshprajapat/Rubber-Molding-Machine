# Problem Statement — DBMS

## Title
IoT-Enabled 4-Pillar Compression Rubber Molding Machine
Data Management System

## Problem
Traditional rubber molding factories rely on manual data 
recording for machine parameters like temperature, pressure, 
and cycle time. This leads to:
- Delayed fault detection
- No historical analysis
- Poor maintenance scheduling
- High defect rates with no traceability

## Proposed Solution
Design and implement a relational database system that:
- Stores real-time sensor readings from IoT-enabled machines
- Maintains operator and maintenance records
- Enables analytical queries for production insights
- Supports alert generation based on threshold violations

## Database Entities
1. machines — Stores machine master data
2. operators — Stores operator/worker information  
3. sensor_readings — Stores every IoT sensor data point
4. maintenance_records — Tracks all maintenance activities
5. alerts — Logs system-generated threshold alerts

## Normalization Justification

### 1NF (First Normal Form) ✅
- All tables have atomic values (no repeating groups)
- Each column holds single values
- Primary keys defined on all tables

### 2NF (Second Normal Form) ✅
- All non-key attributes fully depend on primary key
- No partial dependencies exist
- sensor_readings depends entirely on reading_id

### 3NF (Third Normal Form) ✅
- No transitive dependencies
- operator details stored in operators table (not repeated 
  in maintenance_records)
- machine details stored in machines table (not repeated 
  in sensor_readings)

## Constraints Used
- PRIMARY KEY on all tables
- FOREIGN KEY linking sensor_readings → machines
- FOREIGN KEY linking maintenance_records → machines, operators
- ENUM constraints on status fields
- NOT NULL on critical fields
- UNIQUE on employee_code in operators
- DEFAULT values on timestamps and status fields
