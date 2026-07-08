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

// API Routes
app.use('/api/v1/auth', auth.router);
app.use('/api/v1/telemetry', telemetryRouter);
app.use('/api/v1/dns', dnsRoutes);
app.use('/api/v1/logs', logsRoutes);
app.use('/api/v1/devices', devicesRoutes);
app.use('/api/v1/rules', rulesRoutes);
app.use('/api/v1/analytics', require('./routes/analyticconst express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const telemetryRouter = require('./routes/telemetry');
const dnsServer = require('./dns/server');
const dnsRoutes = require('./routes/dns');
const logsRoutes = require('./routes/logs');
const devicesRoutes = require('./routes/devices');
const rulesRoutes = require('./routes/rules');
const scanner = require('./services/scanner');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/v1/auth', auth.router);
  app.use('/api/v1/telemetry', telemetryRouter);
  app.use('/api/v1/dns', dnsRoutes);
  app.use('/api/v1/logs', logsRoutes);
  app.use('/api/v1/devices', devicesRoutes);
  app.use('/api/v1/rules', rulesRoutes);
  app.use('/api/v1/analytics', require('./routes/analytics'));

  app.get('/api/v1/status', (req, res) => {
    res.json({ status: 'running' });
  });

  // Catch-all route for Next.js frontend
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    dnsServer.start();
    scanner.start();
  });
});s'));

app.get('/api/v1/status', (req, res) => {
  res.json({ status: 'running' });
});

dnsServer.start();
scanner.start();

app.listen(PORT, () => {
  console.log(`CriderShield API running on port ${PORT}`);
});
