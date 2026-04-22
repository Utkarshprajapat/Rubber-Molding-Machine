const express = require('express');
const router = express.Router();
const { promisePool } = require('../db');
const { generateSensorReading } = require('../sensorSimulator');

// POST - Generate and store a new sensor reading
router.post('/reading', async (req, res) => {
  try {
    const reading = generateSensorReading();
    const [result] = await promisePool.query(
      `INSERT INTO sensor_readings 
       (machine_id, temperature, pressure, clamp_force, cycle_time, quality_score, defect_probability, cure_status, machine_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reading.machineId, reading.temperature, reading.pressure, reading.clampForce,
       reading.cycleTime, reading.qualityScore, reading.defectProbability,
       reading.cureStatus, reading.machineStatus]
    );
    reading.reading_id = result.insertId;
    res.status(201).json({ success: true, data: reading });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET - Latest 50 readings
router.get('/latest', async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 50'
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET - Latest reading for specific machine
router.get('/latest/:machineId', async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM sensor_readings WHERE machine_id = ? ORDER BY timestamp DESC LIMIT 1',
      [req.params.machineId]
    );
    res.json({ success: true, data: rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET - Stats for last 1 hour
router.get('/stats', async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      `SELECT 
        ROUND(AVG(temperature), 2) as avg_temperature,
        ROUND(AVG(pressure), 2) as avg_pressure,
        ROUND(AVG(quality_score), 2) as avg_quality_score,
        ROUND(AVG(defect_probability), 2) as avg_defect_probability,
        COUNT(*) as total_readings,
        SUM(CASE WHEN machine_status = 'FAULT' THEN 1 ELSE 0 END) as fault_count,
        SUM(CASE WHEN machine_status = 'WARNING' THEN 1 ELSE 0 END) as warning_count
       FROM sensor_readings 
       WHERE timestamp >= NOW() - INTERVAL 1 HOUR`
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
