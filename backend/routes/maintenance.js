const express = require('express');
const router = express.Router();
const { promisePool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      `SELECT mr.*, m.machine_name, o.name as operator_name 
       FROM maintenance_records mr
       JOIN machines m ON mr.machine_id = m.machine_id
       LEFT JOIN operators o ON mr.operator_id = o.operator_id
       ORDER BY mr.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { machine_id, operator_id, maintenance_type, description, status, scheduled_date } = req.body;
    const [result] = await promisePool.query(
      `INSERT INTO maintenance_records 
       (machine_id, operator_id, maintenance_type, description, status, scheduled_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [machine_id, operator_id, maintenance_type, description, status, scheduled_date]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
