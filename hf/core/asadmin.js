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
 * @class AsAdminParams
 * @description
 * It is a builder interface for the parameters of the execution with the asadmin cli.
 */
class AsAdminParams {

  /**
   * Initialize with the command.
   *
   * @param {String} command the command for the application server.
   */
  constructor(command) {
    /**
     * Domain
     *
     * @type {null|String}
     */
    this.domain = null;

    /**
     * Domain directory
     * @type {null|String}
     */
    this.domainHome = null;

    /**
     * Parameter list
     *
     * @type {Array<String>}
     */
    this.params = [command];
  }

  /**
   * Add the parameter when it is a string.
   *
   * @param {String} param
   * @return {AsAdminParams}
   */
  add(param) {
    if (_.isString(param)) {
      this.params.push(param);
    }
    return this;
  }

  /**
   * Add the port base.
   * @param basePort
   * @return {AsAdminParams}
   */
  addPortBase(basePort) {
    return this.add('--portbase').add(_.toString(basePort));
  }

  /**
   * Add the parameter when the condition is true and it is a string
   * @param {Boolean} condition
   * @param {String} param
   * @return {AsAdminParams}
   */
  addIf(condition, param) {
    if(condition === true && _.isString(param)) {
      this.params.push(param);
    }
    return this;
  }

  /**
   * Add the domain name.
   *
   * @param {String} domain
   * @return {AsAdminParams}
   */
  addDomain(domain) {
    if (_.isString(domain)) {
      this.domain = domain;
    }
    return this;
  }

  /**
   * Add the path to the domain directory.
   *
   * @param {String} domainHome
   * @return {AsAdminParams}
   */
  addDomainHome(domainHome) {
    if (_.isString(domainHome)) {
      this.domainHome = domainHome;
    }
    return this;
  }

  /**
   *
   * @return {Array<String>}
   */
  build() {
    const args = [];
    _.forEach(this.params, (param) => {
      args.push(param);
    });
    if (this.domainHome) {
      args.push('--domaindir', this.domainHome);
    }
    if (this.domain) {
      args.push(this.domain);
    }
    return args;
  }
}

/**
 * Build a new AsAdminParams instance
 * @param {String} command the command for the application server
 * @return {AsAdminParams}
 */
module.exports.newParams = function (command) {
  return new AsAdminParams(command);
};


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

    // options.logDebug('asadmin: ', asadmin);
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
 * @param {Options} options
 * @return {Promise<RunResult>}
 * @see module:hf/core/os#exec
 */
module.exports.startServer = function (options) {
  const that = this;
  return that.getAsAdminSetting(options)
    .then((asAdminSetting) => {

      options.logInfo('Starts domain "%s" ...', asAdminSetting.domainName);

      // build parameters
      const params = that.newParams('start-domain')
        .addDomainHome(asAdminSetting.domainHome)
        .addDomain(asAdminSetting.domainName)
        .addIf(true, '--debug=true')
        .build();
      const env = options.getEnvironment();
      return os.exec(options, asAdminSetting.asadmin, params, env);
    });
};

/**
 * Stops the Payara / Glassfish application server.
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports.stopServer = function (options) {
  const that = this;
  return that.getAsAdminSetting(options)
    .then((asAdminSetting) => {

      options.logInfo('Stops domain "%s" ...', asAdminSetting.domainName);

      const params = that.newParams('stop-domain')
        .addDomainHome(asAdminSetting.domainHome)
        .addDomain(asAdminSetting.domainName)
        .addIf(options.isParam('k', 'kill'), '--kill')
        .build();

      return os.exec(options, asAdminSetting.asadmin, params);
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
      const params = that.newParams('create-domain')
        .addDomainHome(asAdminSetting.domainHome)
        .addDomain(asAdminSetting.domainName)
        .addPortBase(asAdminSetting.portBase)
        .add('--nopassword') // FIXME: add the admin user and password ??
        .build();

      return os.exec(options, asAdminSetting.asadmin, params);
    });
};

/**
 * Remove and delete the domain from the Payara / Glassfish application server.
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports.removeDomain = function (options) {
  const that = this;
  return that.getAsAdminSetting(options)
    .then((asAdminSetting) => {
      return _chooseRemoveDomain(options, asAdminSetting);
    })
    .then((asAdminSetting) => {
      const params = that.newParams('delete-domain')
        .addDomainHome(asAdminSetting.domainHome)
        .addDomain(asAdminSetting.domainName)
        .build();

      return os.exec(options, asAdminSetting.asadmin, params);
    });
};

/**
 * Starts the builtin database "derby"
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports.startDatabase = function (options) {
  const that = this;
  return that.getAsAdminSetting(options)
    .then((asAdminSetting) => {
      const dbHome     = options.getParam('home', null);
      const dbHost     = options.getParam('host', 'localhost');
      const dbPort     = options.getParam('port', '');

      const dbHomePath = options.parseValue(dbHome);

      const params = that.newParams('start-database')
        .addIf(utils.hasStringValue(dbHome), '--dbhome')
        .addIf(utils.hasStringValue(dbHome), dbHomePath)
        .addIf(utils.hasStringValue(dbHost), '--dbhost')
        .addIf(utils.hasStringValue(dbHost), dbHost)
        .addIf(!!dbPort, '--dbport')
        .addIf(!!dbPort, '' + dbPort)
        .build();

      options.logInfo('Starts derby database ...');
      options.logDebug('Parameters: %s', params.join(' '));

      return os.exec(options, asAdminSetting.asadmin, params);
    });
};

/**
 * Stops the database server
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports.stopDatabase = function (options) {
  const that = this;
  return that.getAsAdminSetting(options)
    .then((asAdminSetting) => {
      const dbHost     = options.getParam('host', null);
      const dbPort     = options.getParam('port', null);

      const params = that.newParams('stop-database')
        .addIf(utils.hasStringValue(dbHost), '--dbhost')
        .addIf(utils.hasStringValue(dbHost), dbHost)
        .addIf(!!dbPort, '--dbport')
        .addIf(!!dbPort, '' + dbPort)
        .build();

      options.logInfo('Stops the database server ....');
      options.logDebug('Parameters: %s', params.join(' '));

      return os.exec(options, asAdminSetting.asadmin, params);
    });
};

/**
 * Try to deploy the given application.
 *
 * @param {Options} options
 * @param {AsAdminSetting} asAdminSetting the asadmin settings with the ports
 * @param {String} appName
 * @param {String} filename
 */
module.exports.deployApplication = function (options, asAdminSetting, appName, filename) {
  const that = this;
  options.logInfo('try to deploy "%s" (%s) on domain "%s" ...',
    appName, filename, asAdminSetting.domainName
  );

  return io.hasFile(filename)
    .then((fileExist) => {
      if (!fileExist) {
        return Promise.reject({
          code: 0xfff122,
          message: util.format('Could not deploy on "%s". Archive "%s" is not exist', appName, filename)
        });
      }
      // ${ASADMIN} deploy --port ${DOMAIN_ADMIN_PORT} --force=true --name=${APP_COMP_NAME} ${APP_FILE}
      const params = that.newParams('deploy')
        .add('--port').add(asAdminSetting.adminPort)
        .add('force=true')
        .add('-name=' + appName)
        .add(filename)
        .build();

      return os.exec(asAdminSetting.asadmin, params)
        .then((runResult) => {
          // extends with the appName and filename!
          runResult.appName = appName;
          runResult.filename = filename;

          return runResult;
        });
    });
};

/**
 * Undeploy and remove an application from the server.
 *
 * @param {Options} options
 * @param {AsAdminSetting} asAdminSetting the asadmin settings with port(s)
 * @param {string} appName the application name
 */
module.exports.undeployApplication = function (options, asAdminSetting, appName) {
  const that = this;
  options.logInfo('try to undeploy "%s" on domain "%s" ...', appName, asAdminSetting.domainName);
  // ${ASADMIN} undeploy --port ${DOMAIN_ADMIN_PORT} --cascade=true ${APP_COMP_NAME}
  const params = that.newParams('undeploy')
    .add('--port').add(asAdminSetting.adminPort)
    .add('--cascade=true')
    .add(appName)
    .build();

  return os.exec(asAdminSetting.asadmin, params)
    .then(function (runResult) {
      runResult.appName = appName;
      return runResult;
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

  options.logInfo('Check domain "%s"', asAdminSetting.domainName);

  return io.hasFile(domainDir)
    .then((fileExist) => {

      if (fileExist) {
        return Promise.reject({
          code: 0xfff201,
          message: [
            util.format('Cancel to create domain "%s"', asAdminSetting.domainName),
            'The domain is already existing'
          ]
        });
      }

      options.logInfo('Create domain "%s" ...', asAdminSetting.domainName);
      return asAdminSetting;
    });
}

/**
 * Check whether the domain directory is existing.
 *
 * @param {Options} options
 * @param {AsAdminSetting} asAdminSetting
 * @return {Promise<AsAdminSetting>}
 * @private
 */
function _chooseRemoveDomain(options, asAdminSetting) {

  const domainDir = path.join(asAdminSetting.domainHome, asAdminSetting.domainName);

  options.logInfo('Check domain "%s"', asAdminSetting.domainName);

  return io.hasFile(domainDir)
    .then((fileExist) => {
      if (fileExist) {
        options.logInfo('Delete domain "%s" ...', asAdminSetting.domainName);
        return asAdminSetting;
      }

      return Promise.reject({
        code: 0xfff202,
        message: [
          util.format('Cancel to remove domain "%s"', asAdminSetting.domainName),
          'The domain is unknown. Please create domain before!'
        ]
      });
    })
}
