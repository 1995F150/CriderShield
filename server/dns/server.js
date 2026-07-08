const dgram = require('dgram');
const filter = require('./filter');
const ruleEngine = require('../services/ruleEngine');
const deviceDb = require('../database/deviceDb');

function start() {
  const server = dgram.createSocket('udp4');

  server.on('message', async (msg, rinfo) => {
    // Basic domain extraction (mocking binary parsing for now)
    const msgString = msg.toString('utf8');
    const domainMatch = msgString.match(/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const domain = domainMatch ? domainMatch[0] : 'unknown.local';

    // Get device info to find MAC address for rule engine
    deviceDb.getDevices((err, devices) => {
      const device = devices ? devices.find(d => d.ip_address === rinfo.address) : null;
      const macAddress = device ? device.mac_address : 'unknown';

      // Evaluate rules
      ruleEngine.isBlocked(macAddress, domain).then(isRuleBlocked => {
        let action = 'Allow';
        
        if (isRuleBlocked) {
          action = 'Block (Rule)';
        } else {
          const filterResult = filter.evaluate(domain, rinfo.address);
          action = filterResult.action;
        }

        console.log(`DNS Query: ${domain} from ${rinfo.address} (${macAddress}) - Action: ${action}`);
        // In a real DNS server, logic to respond or block would go here.
      });
    });
  });

  server.bind(53, () => {
    console.log('DNS Server listening on port 53');
  });
}

module.exports = { start };
