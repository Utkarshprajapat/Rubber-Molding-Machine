-- ============================================
-- RUBBER MOLDING MACHINE - DBMS QUERY FILE
-- Subject: Database Management Systems
-- Project: IoT-Enabled 4-Pillar Compression
--          Rubber Molding Machine
-- ============================================

USE rubber_molding_db;

-- ============================================
-- SECTION 1: BASIC SELECT QUERIES
-- ============================================

-- Q1: View all machines
SELECT * FROM machines;

-- Q2: View all operators
SELECT * FROM operators;

-- Q3: View latest 10 sensor readings
SELECT * FROM sensor_readings 
ORDER BY timestamp DESC 
LIMIT 10;

-- Q4: View all active machines only
SELECT machine_id, machine_name, location, status 
FROM machines 
WHERE status = 'ACTIVE';

-- Q5: View all FAULT readings
SELECT reading_id, machine_id, temperature, pressure, 
       machine_status, timestamp
FROM sensor_readings 
WHERE machine_status = 'FAULT'
ORDER BY timestamp DESC;

-- ============================================
-- SECTION 2: JOIN QUERIES
-- ============================================

-- Q6: Get sensor readings WITH machine name (INNER JOIN)
SELECT 
  sr.reading_id,
  m.machine_name,
  m.location,
  sr.temperature,
  sr.pressure,
  sr.clamp_force,
  sr.cycle_time,
  sr.quality_score,
  sr.defect_probability,
  sr.cure_status,
  sr.machine_status,
  sr.timestamp
FROM sensor_readings sr
INNER JOIN machines m ON sr.machine_id = m.machine_id
ORDER BY sr.timestamp DESC
LIMIT 20;

-- Q7: Get maintenance records WITH machine AND operator name
SELECT 
  mr.record_id,
  m.machine_name,
  o.name AS operator_name,
  o.shift,
  mr.maintenance_type,
  mr.description,
  mr.status,
  mr.scheduled_date,
  mr.completed_date
FROM maintenance_records mr
JOIN machines m ON mr.machine_id = m.machine_id
LEFT JOIN operators o ON mr.operator_id = o.operator_id
ORDER BY mr.scheduled_date DESC;

-- Q8: Get all alerts WITH machine name
SELECT 
  a.alert_id,
  m.machine_name,
  a.alert_type,
  a.message,
  a.severity,
  a.is_resolved,
  a.triggered_at
FROM alerts a
JOIN machines m ON a.machine_id = m.machine_id
ORDER BY a.triggered_at DESC;

-- Q9: Get machines that have had FAULT readings (JOIN + WHERE)
SELECT DISTINCT
  m.machine_id,
  m.machine_name,
  m.location,
  COUNT(sr.reading_id) AS total_fault_readings
FROM machines m
JOIN sensor_readings sr ON m.machine_id = sr.machine_id
WHERE sr.machine_status = 'FAULT'
GROUP BY m.machine_id, m.machine_name, m.location;

-- ============================================
-- SECTION 3: GROUP BY QUERIES
-- ============================================

-- Q10: Average temperature and pressure per machine
SELECT 
  m.machine_name,
  COUNT(sr.reading_id) AS total_readings,
  ROUND(AVG(sr.temperature), 2) AS avg_temperature,
  ROUND(AVG(sr.pressure), 2) AS avg_pressure,
  ROUND(AVG(sr.quality_score), 2) AS avg_quality_score,
  ROUND(AVG(sr.defect_probability), 2) AS avg_defect_probability
FROM sensor_readings sr
JOIN machines m ON sr.machine_id = m.machine_id
GROUP BY m.machine_id, m.machine_name;

-- Q11: Count readings by machine status
SELECT 
  machine_status,
  COUNT(*) AS total_readings,
  ROUND(AVG(temperature), 2) AS avg_temp,
  ROUND(AVG(quality_score), 2) AS avg_quality
FROM sensor_readings
GROUP BY machine_status
ORDER BY total_readings DESC;

-- Q12: Count readings by cure status
SELECT 
  cure_status,
  COUNT(*) AS count,
  ROUND(AVG(temperature), 2) AS avg_temp,
  ROUND(AVG(cycle_time), 2) AS avg_cycle_time
FROM sensor_readings
GROUP BY cure_status;

-- Q13: Maintenance count by type
SELECT 
  maintenance_type,
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
  SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress,
  SUM(CASE WHEN status = 'SCHEDULED' THEN 1 ELSE 0 END) AS scheduled
FROM maintenance_records
GROUP BY maintenance_type;

-- Q14: Hourly reading count (GROUP BY hour)
SELECT 
  DATE_FORMAT(timestamp, '%Y-%m-%d %H:00') AS hour_slot,
  COUNT(*) AS readings_count,
  ROUND(AVG(temperature), 2) AS avg_temp,
  ROUND(AVG(quality_score), 2) AS avg_quality
FROM sensor_readings
GROUP BY hour_slot
ORDER BY hour_slot DESC
LIMIT 24;

-- ============================================
-- SECTION 4: NESTED / SUBQUERIES
-- ============================================

-- Q15: Machines with ABOVE AVERAGE quality score (Subquery)
SELECT 
  m.machine_name,
  ROUND(AVG(sr.quality_score), 2) AS machine_avg_quality
FROM sensor_readings sr
JOIN machines m ON sr.machine_id = m.machine_id
GROUP BY m.machine_id, m.machine_name
HAVING AVG(sr.quality_score) > (
  SELECT AVG(quality_score) FROM sensor_readings
);

-- Q16: Get readings where temperature is above 
-- the average temperature (Subquery in WHERE)
SELECT 
  reading_id,
  machine_id,
  temperature,
  pressure,
  machine_status,
  timestamp
FROM sensor_readings
WHERE temperature > (
  SELECT AVG(temperature) FROM sensor_readings
)
ORDER BY temperature DESC
LIMIT 15;

-- Q17: Find machine with highest defect probability (Nested)
SELECT 
  m.machine_name,
  ROUND(AVG(sr.defect_probability), 2) AS avg_defect_prob
FROM sensor_readings sr
JOIN machines m ON sr.machine_id = m.machine_id
GROUP BY m.machine_id, m.machine_name
HAVING avg_defect_prob = (
  SELECT MAX(avg_dp) FROM (
    SELECT AVG(defect_probability) AS avg_dp
    FROM sensor_readings
    GROUP BY machine_id
  ) AS subquery
);

-- Q18: Operators who handled CORRECTIVE maintenance (Subquery)
SELECT 
  name,
  employee_code,
  shift
FROM operators
WHERE operator_id IN (
  SELECT DISTINCT operator_id 
  FROM maintenance_records 
  WHERE maintenance_type = 'CORRECTIVE'
  AND operator_id IS NOT NULL
);

-- Q19: Get latest reading per machine (Correlated Subquery)
SELECT 
  m.machine_name,
  sr.temperature,
  sr.pressure,
  sr.machine_status,
  sr.timestamp
FROM sensor_readings sr
JOIN machines m ON sr.machine_id = m.machine_id
WHERE sr.timestamp = (
  SELECT MAX(sr2.timestamp)
  FROM sensor_readings sr2
  WHERE sr2.machine_id = sr.machine_id
);

-- Q20: Machines that NEVER had a FAULT (NOT IN Subquery)
SELECT machine_name, location, status
FROM machines
WHERE machine_id NOT IN (
  SELECT DISTINCT machine_id 
  FROM sensor_readings 
  WHERE machine_status = 'FAULT'
);

-- ============================================
-- SECTION 5: ANALYTICAL QUERIES (BONUS)
-- ============================================

-- Q21: Quality score trend - flag readings below threshold
SELECT 
  reading_id,
  machine_id,
  quality_score,
  CASE 
    WHEN quality_score >= 90 THEN 'EXCELLENT'
    WHEN quality_score >= 80 THEN 'GOOD'
    WHEN quality_score >= 70 THEN 'AVERAGE'
    ELSE 'POOR'
  END AS quality_grade,
  timestamp
FROM sensor_readings
ORDER BY timestamp DESC
LIMIT 20;

-- Q22: Complete machine health dashboard view
SELECT 
  m.machine_name,
  m.status AS machine_status,
  COUNT(sr.reading_id) AS total_readings,
  ROUND(AVG(sr.temperature), 2) AS avg_temp,
  ROUND(MAX(sr.temperature), 2) AS max_temp,
  ROUND(AVG(sr.pressure), 2) AS avg_pressure,
  ROUND(AVG(sr.quality_score), 2) AS avg_quality,
  ROUND(AVG(sr.defect_probability), 2) AS avg_defect_prob,
  SUM(CASE WHEN sr.machine_status = 'FAULT' THEN 1 ELSE 0 END) AS fault_count,
  COUNT(DISTINCT mr.record_id) AS maintenance_count
FROM machines m
LEFT JOIN sensor_readings sr ON m.machine_id = sr.machine_id
LEFT JOIN maintenance_records mr ON m.machine_id = mr.machine_id
GROUP BY m.machine_id, m.machine_name, m.status;
