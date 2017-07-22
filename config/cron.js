const cronService = require('../api/services/cronService');

module.exports.cron = {
  checkMinecraft: {
    schedule: '0 * * * * *',
    onTick: function() {
      cronService.checkServerAndShutdown();
    }
  }
}