const path = require('path');
const googleCloudCompute = require('@google-cloud/compute');

module.exports = {
  getPriceListAsync: function() {
    return fetch('https://cloudpricingcalculator.appspot.com/static/data/pricelist.json');
  },

  getInstanceAsync: function (projectId, authJson, zoneId, instanceId) {
    return new Promise((resolve, reject) => {
      sails.log.debug('get instance', projectId, authJson, zoneId, instanceId);
      const authJsonAbsolutePath = path.resolve(`${__dirname}/../../gce/auth/${authJson}`);
      const gce = googleCloudCompute({
        projectId: projectId,
        keyFilename: authJsonAbsolutePath
      });
      const zone = gce.zone(zoneId);
      const vm = zone.vm(instanceId);

      vm.get((error, operation, responce) => {
        sails.log.debug(error, operation, responce);
        if (error) {
          resolve({
            success: false,
            error_reason: error,
          });
        } else {
          resolve({
            success: true,
            result: responce,
          });
        }
      });
    });
  },

  startInstanceAsync: function (projectId, authJson, zoneId, instanceId) {
    return new Promise((resolve, reject) => {
      sails.log.debug('start instance', projectId, authJson, zoneId, instanceId);
      const authJsonAbsolutePath = path.resolve(`${__dirname}/../../gce/auth/${authJson}`);
      const gce = googleCloudCompute({
        projectId: projectId,
        keyFilename: authJsonAbsolutePath
      });
      const zone = gce.zone(zoneId);
      const vm = zone.vm(instanceId);

      vm.start((error, operation, responce) => {
        sails.log.debug(error, operation, responce);
        if (error) {
          resolve({
            success: false,
            error_reason: error,
          });
        } else {
          resolve({
            success: true,
            result: responce,
          });
        }
      });
    });
  },

  stopInstanceAsync: function (projectId, authJson, zoneId, instanceId) {
    return new Promise((resolve, reject) => {
      sails.log.debug('stop instance', projectId, authJson, zoneId, instanceId);
      const authJsonAbsolutePath = path.resolve(`${__dirname}/../../gce/auth/${authJson}`);
      const gce = googleCloudCompute({
        projectId: projectId,
        keyFilename: authJsonAbsolutePath
      });
      const zone = gce.zone(zoneId);
      const vm = zone.vm(instanceId);

      vm.stop((error, operation, responce) => {
        sails.log.debug(error, operation, responce);
        if (error) {
          resolve({
            success: false,
            error_reason: error,
          });
        } else {
          resolve({
            success: true,
            result: responce,
          });
        }
      });
    });
  },
}
