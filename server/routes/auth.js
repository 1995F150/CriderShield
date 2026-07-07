const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// First-time admin creation
router.post('/setup', async (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (row.count > 0) return res.status(400).json({ message: "Setup already completed" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, hashedPassword, 'Admin'], function(err) {
      if (err) return res.status(500).json({ message: "Error creating admin" });
      res.json({ message: "Admin created successfully" });
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ message: "Logged in", user: { username: user.username, role: user.role } });
  });
});

router.get('/me', auth(), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
