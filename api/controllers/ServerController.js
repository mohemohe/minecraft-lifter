/**
 * ServerController
 *
 * @description :: Server-side logic for managing servers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const GceService = require('../services/gceService');

const cacheStore = {};

module.exports = {
  /**
   * `ServerController.status()`
   */
  status: async function (req, res) {
    const config = sails.config.minecraft[req.headers.host];
    let result = {};
    const cache = cacheStore[`${config.gce.projectId}${config.gce.zone}${config.gce.instanceId}`] || {};
    if(cache.lastUpdate && cache.lastUpdate.getTime() < new Date().getTime() - 5 * 1000) {
      sails.log.debug('cache hit');
      return res.json(cache.result);
    } else {
      const response = await GceService.getInstanceAsync(config.gce.projectId, config.gce.authJson, config.gce.zone, config.gce.instanceId);
      cache.lastUpdate = new Date();
      cache.result = response;
      cacheStore[`${config.gce.projectId}${config.gce.zone}${config.gce.instanceId}`] = cache;
      result = response;
    }
    return res.json(result);
  },

  /**
   * `ServerController.power()`
   */
  state: async function (req, res) {
    if(req.method.toLowerCase() !== 'post') {
      res.status(405);
      res.send('Invalid method');
    } else {
      const config = sails.config.minecraft[req.headers.host];
      let response = {};
      switch (req.body.state) {
        case 'start':
          {
            const result = await GceService.startInstanceAsync(config.gce.projectId, config.gce.authJson, config.gce.zone, config.gce.instanceId);
            response = result;
          }
          break;

        case 'stop':
          {
            const result = await GceService.stopInstanceAsync(config.gce.projectId, config.gce.authJson, config.gce.zone, config.gce.instanceId);
            response = result;
          }
          break;

        default:
          {
            response.success = false;
            response.error_reson = 'Invalid value';
          }
          break;
      }
      return res.json(response);
    }
  },
};

