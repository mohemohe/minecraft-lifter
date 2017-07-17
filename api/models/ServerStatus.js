/**
 * ServerStatus.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    domain: {
      type: 'string',
    },
    port: {
      type: 'integer',
    },
    non_user_minutes: {
      type: 'integer',
      defaultsTo: 0,
    }
  }
};

