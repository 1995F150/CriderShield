const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'rules.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    target TEXT,
    action TEXT NOT NULL,
    domain TEXT,
    category TEXT,
    schedule TEXT,
    expires_at DATETIME,
    priority INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT 1
  )`);
});

module.exports = {
  getAll: (callback) => {
    db.all("SELECT * FROM rules ORDER BY priority DESC", callback);
  },
  getById: (id, callback) => {
    db.get("SELECT * FROM rules WHERE id = ?", [id], callback);
  },
  create: (rule, callback) => {
    const { type, target, action, domain, category, schedule, expires_at, priority, enabled } = rule;
    db.run(
      "INSERT INTO rules (type, target, action, domain, category, schedule, expires_at, priority, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [type, target, action, domain, category, schedule, expires_at, priority, enabled],
      function(err) {
        callback(err, this.lastID);
      }
    );
  },
  update: (id, rule, callback) => {
    const { type, target, action, domain, category, schedule, expires_at, priority, enabled } = rule;
    db.run(
      "UPDATE rules SET type = ?, target = ?, action = ?, domain = ?, category = ?, schedule = ?, expires_at = ?, priority = ?, enabled = ? WHERE id = ?",
      [type, target, action, domain, category, schedule, expires_at, priority, enabled, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.run("DELETE FROM rules WHERE id = ?", [id], callback);
  }
};
