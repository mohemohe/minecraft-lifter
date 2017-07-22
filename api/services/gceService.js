const path = require('path');
const fetch = require('node-fetch')
const googleCloudCompute = require('@google-cloud/compute');

module.exports = {
  getPriceAsync: function(projectId, authJson, zoneId, instanceId) {
    return new Promise(async (resolve, reject) => {
      const result = {};
      const response = await fetch('https://cloudpricingcalculator.appspot.com/static/data/pricelist.json');
      if(!response.ok) {
        result.success = false;
        resolve(result);
        return;
      }
      const priceList = await response.json();
      const instanceInfo = await gceService.getInstanceAsync(projectId, authJson, zoneId, instanceId);
      if(!instanceInfo.success) {
        resolve(instanceInfo);
        return;
      }
      result.success = true;

      const machineType = instanceInfo.result.machineType.split('/').slice(-1)[0];
      const machineTypeKey = `CP-COMPUTEENGINE-VMIMAGE-${machineType.toUpperCase()}`;
      const priceObject = priceList.gcp_price_list[machineTypeKey];
      Object.keys(priceObject).forEach((key) => {
        if(zoneId.indexOf(key) > -1) {
          result.price = priceObject[key];
        }
      });
      resolve(result);
    });
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

      vm.get((error, operation, response) => {
        sails.log.debug(error, operation, response);
        if (error) {
          resolve({
            success: false,
            error_reason: error,
          });
        } else {
          resolve({
            success: true,
            result: response,
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

      vm.start((error, operation, response) => {
        sails.log.debug(error, operation, response);
        if (error) {
          resolve({
            success: false,
            error_reason: error,
          });
        } else {
          resolve({
            success: true,
            result: response,
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

      vm.stop((error, operation, response) => {
        sails.log.debug(error, operation, response);
        if (error) {
          resolve({
            success: false,
            error_reason: error,
          });
        } else {
          resolve({
            success: true,
            result: response,
          });
        }
      });
    });
  },
}
