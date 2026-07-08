const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const telemetryRouter = require('./routes/telemetry');
const dnsServer = require('./dns/server');
const dnsRoutes = require('./routes/dns');
const logsRoutes = require('./routes/logs');
const devicesRoutes = require('./routes/devices');
const rulesRoutes = require('./routes/rules');
const scanner = require('./services/scanner');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.json({
    cpu: Math.floor(Math.random() * 100) + '%',
    ram: Math.floor(Math.random() * 64) + ' GB',
    storage: '45%',
    uptime: '14d 2h 15m',
    dnsRequests: Math.floor(Math.random() * 50000),
    blockedRequests: Math.floor(Math.random() * 5000),
    dockerStatus: 'Healthy'
  });
});

app.use('/api/v1/telemetry', auth, telemetryRouter);
app.use('/api/v1/dns', dnsRoutes);
app.use('/api/v1/logs', logsRoutes);
app.use('/api/v1/devices', devicesRoutes);
app.use('/api/v1/rules', rulesRoutes);

scanner.startScanner();

app.listen(PORT, () => {
  console.log(`CriderShield API running on port ${PORT}`);
});
