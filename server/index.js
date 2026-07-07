const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/v1/health', (req, res) => {
  res.json({
    cpu: Math.floor(Math.random() * 100) + '%',
    ram: Math.floor(Math.random() * 64) + ' GB',
    storage: '45%',
    uptime: '14d 2h 15m',
    dnsRequests: Math.floor(Math.random() * 50000),
    blockedRequests: Math.floor(Math.random() * 5000),
    dockerStatus: 'Healthy',
    tunnelStatus: 'Online'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
