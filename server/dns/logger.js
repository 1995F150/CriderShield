class DNSLogger {
  constructor() {
    this.logs = [];
    this.stats = { totalQueries: 0, blockedCount: 0 };
  }
  log(query) {
    this.logs.unshift(query);
    if (this.logs.length > 500) this.logs.pop();
    this.stats.totalQueries++;
    if (query.status === 'BLOCK') this.stats.blockedCount++;
  }
  getLogs() { return this.logs; }
  getStats() { return this.stats; }
}
module.exports = new DNSLogger();
