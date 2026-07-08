const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(process.env.DB_PATH || path.join(__dirname, '../../data/rules.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    domains TEXT -- JSON array of domains
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    days TEXT, -- e.g., "1,2,3,4,5"
    start_time TEXT, -- "HH:mm"
    end_time TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mac_address TEXT,
    category_id INTEGER,
    schedule_id INTEGER,
    action TEXT DEFAULT 'Block',
    enabled INTEGER DEFAULT 1,
    FOREIGN KEY(mac_address) REFERENCES devices(mac_address),
    FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN KEY(schedule_id) REFERENCES schedules(id)
  )`);
  
  // Seed basic categories
  db.run(`INSERT OR IGNORE INTO categories (name, domains) VALUES ('Social Media', '["facebook.com", "instagram.com", "tiktok.com", "twitter.com"]')`);
  db.run(`INSERT OR IGNORE INTO categories (name, domains) VALUES ('Gaming', '["steamcommunity.com", "roblox.com", "epicgames.com"]')`);
});

const getRules = (cb) => {
  const sql = `
    SELECT r.*, c.name as category_name, s.name as schedule_name 
    FROM rules r
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN schedules s ON r.schedule_id = s.id
  `;
  db.all(sql, cb);
};

const addRule = (rule, cb) => {
  db.run(`INSERT INTO rules (mac_address, category_id, schedule_id, action) VALUES (?, ?, ?, ?)`, 
    [rule.mac_address, rule.category_id, rule.schedule_id, rule.action || 'Block'], cb);
};

const deleteRule = (id, cb) => db.run(`DELETE FROM rules WHERE id = ?`, [id], cb);

const getCategories = (cb) => db.all(`SELECT * FROM categories`, cb);
const getSchedules = (cb) => db.all(`SELECT * FROM schedules`, cb);

module.exports = { db, getRules, addRule, deleteRule, getCategories, getSchedules };
