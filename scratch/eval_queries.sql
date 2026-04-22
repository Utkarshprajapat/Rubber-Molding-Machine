USE rubber_molding_db;

-- Step 4
SELECT COUNT(*) as total FROM sensor_readings;
SELECT machine_status, COUNT(*) FROM sensor_readings GROUP BY machine_status;

-- Step 5
-- Q6
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
LIMIT 5;

-- Q10
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

-- Q11
SELECT 
  machine_status,
  COUNT(*) AS total_readings,
  ROUND(AVG(temperature), 2) AS avg_temp,
  ROUND(AVG(quality_score), 2) AS avg_quality
FROM sensor_readings
GROUP BY machine_status
ORDER BY total_readings DESC;

-- Q15
SELECT 
  m.machine_name,
  ROUND(AVG(sr.quality_score), 2) AS machine_avg_quality
FROM sensor_readings sr
JOIN machines m ON sr.machine_id = m.machine_id
GROUP BY m.machine_id, m.machine_name
HAVING AVG(sr.quality_score) > (
  SELECT AVG(quality_score) FROM sensor_readings
);

-- Q22
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
