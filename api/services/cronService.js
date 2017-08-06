const minecraftConfig = require('../../config/minecraft').minecraft;
const minecraftService = require('./minecraftService');
const gceService = require('./gceService');

module.exports = {
  checkServerAndShutdown: function() {
    sails.log.info(`[${new Date()}] start check Minecraft server status`);
    Object.keys(minecraftConfig).forEach(async function(key) {
      const servername = key;
      const config = this[key];

      sails.log.info(`${servername} -> ${config.minecraft.server}`);

      const minecraftServerStatus = await minecraftService.minecraftQueryAsync(config.minecraft.server, config.minecraft.port);
      sails.log.debug(`[${config.minecraft.server}] Minecraft query status:`, minecraftServerStatus);

      let serverStatus;
      try {
        serverStatus = await ServerStatus.findOrCreate({
          domain: config.minecraft.server,
          port: config.minecraft.port,
        });
      } catch (error) {
        sails.log.error(`[${config.minecraft.server}] DB connection error:`, error);
        return;
      }
      sails.log.debug(`[${config.minecraft.server}] Current DB data:`, serverStatus);

      let nonUserMinutes = serverStatus.non_user_minutes;
      if (minecraftServerStatus.success) {
        const players = minecraftServerStatus.result.numplayers;
        if (players > 0) {
          nonUserMinutes = 0;
        } else {
          nonUserMinutes++;
        }
      } else {
        nonUserMinutes = -1;
      }

      let updateResult;
      try {
        updateResult = await ServerStatus.update({
          domain: config.minecraft.server,
          port: config.minecraft.port,
        }, {
          non_user_minutes: nonUserMinutes,
        });
      } catch (error) {
        sails.log.error(`[${config.minecraft.server}] DB update error:`, error);
        return;
      }
      sails.log.debug(`[${config.minecraft.server}] DB update success:`, updateResult);

      let result;
      if(updateResult.length) {
        result = updateResult[0];
      } else {
        result = updateResult;
      }
      sails.log.debug(`[${config.minecraft.server}] DB selected result:`, result);

      if(result.non_user_minutes > config.gce.shutdownMinutes) {
        const gceResult = await gceService.getInstanceAsync(config.gce.projectId, config.gce.authJson, config.gce.zone, config.gce.instanceId);
        if(gceResult.result.status.toLowerCase() !== 'stopping' || gceResult.result.status.toLowerCase() !== 'terminated') {
          sails.log.info(`[${config.minecraft.server}] start shutting down the instance: ${minecraftConfig}`);
          const stopResult = await gceService.stopInstanceAsync(config.gce.projectId, config.gce.authJson, config.gce.zone, config.gce.instanceId);
        }
      } else {
        sails.log.info(`${servername} -> ${config.minecraft.server}: NOP`);
      }
    }, minecraftConfig);
  }
}
