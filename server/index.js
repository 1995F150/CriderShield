const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const telemetryRouter = require('./routes/telemetry');

const app = express();
app.use(cors());

app.get('/api/v1/health', (req, res) => {
  res.json({
    cpu: Math.floor(Math.random() * 100) + '%',
    ram: Math.floor(Math.random() * 64) + ' GB',
    storage: '45%',
    uptime: '14d 2h 15m',
    dnsRequests: Math.floor(Math.random() * 50000),const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const telemetryRouter = require('./routes/telemetry');
const dnsServer = require('./dns/server');
const dnsRouter = require('./routes/dns');

const app = express();
app.use(cors());
app.use(express.json());

dnsServer.start();

app.use('/api/v1/telemetry', telemetryRouter);
app.use('/api/v1/dns', dnsRouter);

app.get('/api/v1/health', (req, res) => {
  res.json({
    cpu: Math.floor(Math.random() * 100) + '%',
    ram: Math.floor(Math.random() * 64) + ' GB',
    storage: '45%',
    uptime: '14d 2h 15m',
    dnsRequests: Math.floor(Math.random() * 50000),
    blockedRequests: Math.floor(Math.random() * 5000),
    dockerStatus: 'Healthy',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
    blockedRequests: Math.floor(Math.random() * 5000),
    dockerStatus: 'Healthy',
  });
});

app.use('/api/v1/telemetry', auth, telemetryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
