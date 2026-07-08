const dgram = require('dgram');
const filter = require('./filter');

function start() {
  const server = dgram.createSocket('udp4');

  server.on('message', (msg, rinfo) => {
    // Basic domain extraction (mocking binary parsing for now)
    const msgString = msg.toString('utf8');
    const domainMatch = msgString.match(/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const domain = domainMatch ? domainMatch[0] : 'unknown.local';

    const result = filter.evaluate(domain, rinfo.address);
    
    console.log(`DNS Query: ${domain} from ${rinfo.address} - Action: ${result.action}`);

    // Mock forwarding/blocking behavior.
    if (result.action === 'BLOCK') {
       console.log(`Blocked ${domain}`);
    } else {
       console.log(`Forwarding ${domain} to 1.1.1.1`);
    }
  });

  server.on('error', (err) => {
    console.error(`DNS Server error: ${err.stack}`);
    server.close();
  });

  server.bind(5300, () => {
    console.log('DNS Filtering Server listening on port 5300');
  });
}

module.exports = { start };
