const rulesDb = require('../database/rulesDb');

const isBlocked = async (macAddress, domain) => {
  return new Promise((resolve) => {
    rulesDb.getRules((err, rules) => {
      if (err) return resolve(false);
      
      const activeRules = rules.filter(r => r.mac_address === macAddress && r.enabled);
      if (activeRules.length === 0) return resolve(false);

      const now = new Date();
      const currentDay = now.getDay(); // 0-6
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      for (const rule of activeRules) {
        // Schedule Check
        if (rule.schedule_id && rule.days) {
          const days = rule.days.split(',').map(Number);
          if (!days.includes(currentDay)) continue;
          if (rule.start_time && rule.end_time) {
            if (currentTime < rule.start_time || currentTime > rule.end_time) continue;
          }
        }

        // Domain Check
        try {
          const domains = JSON.parse(rule.domains || '[]');
          if (domains.some(d => domain.toLowerCase().includes(d.toLowerCase()))) {
            return resolve(rule.action === 'Block');
          }
        } catch (e) {
          console.error('Error parsing rule domains', e);
        }
      }
      resolve(false);
    });
  });
};

module.exports = { isBlocked };
