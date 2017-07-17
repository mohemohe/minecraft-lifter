const cronService = require('../api/services/cronService');

module.exports.cron = {
  checkMinecraft: {
    schedule: '*/10 * * * * *',
    onTick: function() {
      cronService.checkServerAndShutdown();
    }
  }
}