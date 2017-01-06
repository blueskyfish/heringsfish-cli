/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/server/asadmin
 * @description
 * The module contains the asadmin commands
 *
 * @requires path
 * @requires lodash
 * @requires q
 * @requires module:hf/config
 * @requires module:hf/logger
 * @requires module:hf/core/builder
 */

const path    = require('path');

const _       = require('lodash');
const Q       = require('q');

const config  = require('lib/config');
const logger  = require('lib/logger');
const builder = require('lib/core/builder');


/**
 * @name AsAdminSetting
 * @description The object contains the settings for asadmin.
 * @property {string} asadmin the command
 * @property {string} domainHome the home directory of the domains
 * @property {string} domainName the name of the domain
 * @property {number} [portBase] the base port.
 * @property {number} [adminPort] the port number of the admin console.
 */

/**
 * Returns the setting values for ASADMIN. In case of success the promise then part call a
 * function AsAdminSetting parameter.
 *
 * @param {boolean} [includeAdminPort] add the base and admin port to the setting result
 * @return {promise} the promise resolve callback has the parameter from type {@type AsAdminSetting}.
 */
module.exports.getAsAdminSettingValues = function (includeAdminPort) {
  return Q.fcall(function () {
    var messages = [];
    var asadmin = path.normalize(_getAsAdminCommand());
    var domainHome = path.normalize(config.parseValue(config.getConfig('domain.home', null)));
    var domainName = config.getConfig('domain.name', null);
    logger.debug('asadmin: ', asadmin);
    if (!asadmin || !builder.isDefined(asadmin)) {
      messages.push('The setting "command.asadmin" is required!');
    }
    if (!builder.isDefined(domainHome)) {
      messages.push('The setting "domain.home" is required!');
    }
    if (!builder.isDefined(domainName)) {
      messages.push('The setting "domain.name" is required!');
    }
    if (_.size(messages) > 0) {
      return Q.reject(builder.createError(null, messages.join('\n')));
    }
    /** @type {AsAdminSetting} */
    var values = {
      asadmin:    asadmin,
      domainHome: domainHome,
      domainName: domainName
    };
    if (includeAdminPort === true) {
      var portBase = config.getConfig('domain.ports.base', 8000);
      var adminPort = config.getConfig('domain.ports.admin', -1);
      if (adminPort <= 0) {
        adminPort = portBase + 48;
      }
      values.portBase = portBase;
      values.adminPort = adminPort;
    }
    return Q.resolve(values);
  });

};




//
// internal functions
//

/**
 *
 * @return {String}
 * @private
 */
function _getAsAdminCommand() {
  var serverHome = config.getConfig('server.home', null);
  var command = config.getConfig('command.asadmin', null, true);
  if (!builder.isDefined(serverHome) || !command) {
    return null;
  }
  return config.parseValue(command);
}
