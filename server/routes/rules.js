const express = require('express');
const router = express.Router();
const rulesDb = require('../database/rulesDb');

router.get('/', (req, res) => {
  rulesDb.getRules((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  rulesDb.addRule(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

router.delete('/:id', (req, res) => {
  rulesDb.deleteRule(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

router.get('/categories', (req, res) => {
  rulesDb.getCategories((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/schedules', (req, res) => {
  rulesDb.getSchedules((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
