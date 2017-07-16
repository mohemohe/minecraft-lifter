module.exports.cron = {
  checkMinecraft: {
    schedule: '*/2 * * * * *',
    onTick: function() {
      sails.log.debug(`${new Date()} start check Minecraft server status`);
    }
  }
}