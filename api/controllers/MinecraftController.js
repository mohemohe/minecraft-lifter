/**
 * MinecraftController
 *
 * @description :: Server-side logic for managing minecrafts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const MinecraftService = require('../services/minecraftService');

module.exports = {



  /**
   * `MinecraftController.status()`
   */
  status: async function (req, res) {
    const config = sails.config.minecraft[req.headers.host];
    if(!config) {
      return res.json({
        success: false,
        result: 'error',
      });
    }

    const server = config.minecraft.server;
    const port = config.minecraft.port;
    const status = await MinecraftService.minecraftQueryAsync(server, port);
    return res.json(status);
  },

};

