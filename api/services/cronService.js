const minecraftConfig = require('../../config/minecraft');
const minecraftService = require('./minecraftService');
const gceService = require('./gceService');

module.exports = {
  checkServerAndShutdown: function() {
    sails.log.debug(`${new Date()} start check Minecraft server status`);
    Object.keys(minecraftConfig).forEach(async function(key) {
      const servername = Object.keys(this[key])[0];
      const config = Object.values(this[key])[0];

      sails.log.debug(servername, config.minecraft.server);
      const minecraftServerStatus = await minecraftService.minecraftQueryAsync(config.minecraft.server, config.minecraft.port);
      sails.log.debug(minecraftServerStatus);

      if (minecraftServerStatus.success) {
        const players = parseInt(minecraftServerStatus.result.numplayers, 10);
        if (!isNaN(players)) {
          const dbResult = await (() => {
            return new Promise((resolve, reject) => {
              ServerStatus.findOrCreate({
                domain: config.minecraft.server,
                port: config.minecraft.port,
              }).exec((error, result) => {
                if (error) {
                  resolve({
                    success: false,
                    error_reason: error,
                  });
                } else {
                  sails.log.debug(result);
                  let nonUserMinutes = result.non_user_minutes;
                  if (players > 0) {
                    nonUserMinutes = 0;
                  } else {
                    nonUserMinutes++;
                  }
                  ServerStatus.update({
                    id: result.id,
                  }, {
                    non_user_minutes: nonUserMinutes,
                  }).exec((e, r) => {
                    if (e) {
                      resolve({
                        success: false,
                        error_reason: e,
                      });
                    } else {
                      resolve({
                        success: true,
                        result: r[0],
                      });
                    }
                  });
                }
              });
            });
          })();
          sails.log.debug(dbResult);
          if(dbResult.result.non_user_minutes > config.gce.shutdownMinutes) {
            const getResult = await gceService.getInstanceAsync(config.gce.projectId, config.gce.authJson, config.gce.zone, config.gce.instanceId);
            if(getResult.result.status.toLowerCase() !== 'stopping' || getResult.result.status.toLowerCase() !== 'terminated') {
              const stopResult = await gceService.stopInstanceAsync(config.gce.projectId, config.gce.authJson, config.gce.zone, config.gce.instanceId);
            }
          }
        }
      }
    }, minecraftConfig);
  }
}
