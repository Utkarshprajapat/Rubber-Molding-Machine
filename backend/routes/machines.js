const express = require('express');
const router = express.Router();
const { promisePool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM machines');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM machines WHERE machine_id = ?', [req.params.id]
    );
    res.json({ success: true, data: rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await promisePool.query(
      'UPDATE machines SET status = ? WHERE machine_id = ?', [status, req.params.id]
    );
    res.json({ success: true, message: 'Machine status updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
