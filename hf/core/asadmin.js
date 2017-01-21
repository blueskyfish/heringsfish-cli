/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/asadmin
 * @description
 * A helper library for working with asadmin cli.
 *
 * @requires path
 * @requires lodash
 */

const path   = require('path');

const _      = require('lodash');

const utils  = require('hf/core/utils');
const runner = require('hf/core/runner');

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
 * **Errors**
 *
 * | Error     | Message
 * |-----------|----------------------------
 * | 0xff00a1  | Missing AsAdmin settings
 *
 * @param {Options} options the options
 * @param {boolean} [includeAdminPort] add the base and admin port to the setting result
 * @return {Promise<AsAdminSetting>}
 */
module.exports.getAsAdminSetting = function (options, includeAdminPort) {
  return new Promise(function _getAsAdminSetting<AsAdminSetting> (resolve, reject) {
    const messages   = [];

    const asadmin    = _getAsAdminCommand(options);
    const domainHome = options.parseValue(options.getConfig('domain.home', null));
    const domainName = options.getConfig('domain.name', null);

    options.logDebug('asadmin: ', asadmin);
    if (!asadmin || !utils.hasStringValue(asadmin)) {
      messages.push('The setting "command.asadmin" is required!');
    }
    if (!utils.hasStringValue(domainHome)) {
      messages.push('The setting "domain.home" is required!');
    }
    if (!utils.hasStringValue(domainName)) {
      messages.push('The setting "domain.name" is required!');
    }
    if (_.size(messages) > 0) {
      // logs the error messages
      _.forEach(messages, function (message) {
        options.logError(message);
      });

      return reject({
        code: 0xff00a1,
        message: 'Missing AsAdmin settings'
      });
    }

    /** @type {AsAdminSetting} */
    let values = {
      asadmin:    path.normalize(asadmin),
      domainHome: path.normalize(domainHome),
      domainName: domainName
    };

    if (includeAdminPort === true) {
      const portBase = options.getConfig('domain.ports.base', 8000);
      let adminPort = options.getConfig('domain.ports.admin', -1);
      if (adminPort <= 0) {
        adminPort = portBase + 48;
      }
      values.portBase = portBase;
      values.adminPort = adminPort;
    }
    resolve(values);
  });
};

/**
 * Starts the Payara / Glassfish application server.
 *
 * **Errors**
 *
 * See at the runner module.
 *
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports.startServer = function (options) {
  const that = this;
  return that.getAsAdminSetting(options)
    .then(function (asAdminSetting) {
      options.logInfo('Starts domain "%s" ...', asAdminSetting.domainName);
      // build parameters
      const params = [
        'start-domain',
        '--domaindir', asAdminSetting.domainHome,
        '--debug=true',
        asAdminSetting.domainName
      ];
      const env = options.getEnvironment();
      return runner(options, asAdminSetting.asadmin, params, env);
    });
};


//
// internal functions
//

/**
 * Returns the AsAdmin command
 * @param {Options} options
 * @return {String}
 * @private
 */
function _getAsAdminCommand(options) {
  const serverHome = options.getConfig('server.home', null);
  const command = options.getConfig('command.asadmin', null, true);
  if (!utils.hasStringValue(serverHome) || !command) {
    return null;
  }
  return options.parseValue(command);
}
