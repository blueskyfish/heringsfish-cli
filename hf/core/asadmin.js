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

const path    = require('path');
const util    = require('util');

const _       = require('lodash');

const io      = require('hf/core/io');
const os      = require('hf/core/os');
const utils   = require('hf/core/utils');

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
  return new Promise((resolve, reject) => {
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
    .then((asAdminSetting) => {
      options.logInfo('Starts domain "%s" ...', asAdminSetting.domainName);
      // build parameters
      const params = [
        'start-domain',
        '--domaindir', asAdminSetting.domainHome,
        // TODO add a config setting (server.debug = true / false)
        '--debug=true',
        asAdminSetting.domainName
      ];
      const env = options.getEnvironment();
      return os.exec(options, asAdminSetting.asadmin, params, env);
    });
};

/**
 * Creates the domain for the Payara / Glassfish application server.
 *
 * If the domain is already exist then it cancels of creation of the domain.
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports.createDomain = function (options) {
  const that = this;
  return that.getAsAdminSetting(options, true)
    .then((asAdminSetting) => {
      return _chooseCreateDomain(options, asAdminSetting);
    })
    .then((asAdminSetting) => {
      // build parameters
      const params = [
        'create-domain',
        '--portbase', asAdminSetting.portBase,
        '--domaindir', asAdminSetting.domainHome,
        // TODO add the admin console password ?? (server.admin.password + server.admin.username)
        '--nopassword',
        asAdminSetting.domainName
      ];

      return os.exec(asAdminSetting.asadmin, params);
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
  const serverHome = options.getConfig('server.home', options.getConfig('settings.server.home', null));
  const command = options.getConfig('command.asadmin', null, true);
  if (!utils.hasStringValue(serverHome) || !command) {
    return null;
  }
  return options.parseValue(command);
}

/**
 * Check whether the domain directory is exist and if the argument `-f` or `--force` is present.
 *
 * @param {Options} options
 * @param {AsAdminSetting} asAdminSetting
 * @return {Promise<AsAdminSetting>}
 * @private
 */
function _chooseCreateDomain(options, asAdminSetting) {

  const domainDir = path.join(asAdminSetting.domainHome, asAdminSetting.domainName);

  options.logInfo('Check the domain "%s"', asAdminSetting.domainName);

  return io.hasFile(domainDir)
    .then((fileExist) => {

      if (fileExist) {
        return Promise.reject({
          code: 0xfff201,
          message: util.format('Cancel to create domain "%s"', asAdminSetting.domainName)
        });
      }

      options.logInfo('Create domain "%s" ...', asAdminSetting.domainName);
      return asAdminSetting;
    });
}
