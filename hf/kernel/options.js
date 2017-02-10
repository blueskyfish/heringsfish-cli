/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/kernel/options
 *
 * @requires util
 * @requires lodash
 * @requires moment
 * @requires colors
 * @requires module:hf/defines
 */

const util    = require('util');

const _       = require('lodash');
const moment  = require('moment');
const colors  = require('colors');

const DEFINES = require('hf/defines');



/**
 * @class Options
 *
 */
class Options {

  /**
   *
   * @param {Parameters} params
   * @param {Object} configs
   * @param {Registry} registry
   * @constructor
   */
  constructor(params, configs, registry) {
    /**
     * @type {Parameters}
     */
    this.params = params;
    /**
     * The object of the server-config.json
     * @type {Object}
     */
    this.configs = configs;

    /**
     * The plugin Registry
     * @type {Registry}
     */
    this.registry = registry;
  }

  /**
   * Returns the argument settings. The `name` parameter is either a number or a string. Depending on the type of the
   * parameter either the list or options is used to determine the value.
   *
   * @param {String|number} name determines whether the list or the options are used.
   * @param {String|Boolean} defValue the default value if the name is not exist.
   * @return {String|Boolean}
   */
  getParam(name, defValue) {
    if (_.isNumber(name)) {
      return this.params.list[name] || defValue;
    }
    return this.params.options[name] || defValue;
  }

  /**
   * Checks the state of the given short or long argument.
   *
   * ```js
   * if (options.isParam('v', 'verbose')) {
   *   // verbose is on
   * }
   * ```
   *
   * @param {String} shortName the short name of the argument
   * @param {String} longName the long name of the argument
   * @return {Boolean}
   */
  isParam(shortName, longName) {
    return this.getParam(shortName, false) || this.getParam(longName, false);
  }

  /**
   * Returns the arguments value.
   *
   * @param {String} shortName the short name of the argument
   * @param {String} longName the long name of the argument
   * @param {String|null} defValue
   * @return {String|null}
   */
  getParamByNames(shortName, longName, defValue) {
    return this.getParam(shortName, null) || this.getParam(longName, null) || defValue;
  }

  /**
   * Returns the current action.
   *
   * @return {String} the given action
   */
  getAction() {
    return this.params.action;
  }

  /**
   * Returns the value of the configuration property from the given name.
   *
   * @param {string} name
   * @param {*} defValue
   * @param {boolean} [checkPlatform] if a value is depend on a platform, then it use the value `true`
   * @return {*}
   */
  getConfig(name, defValue, checkPlatform) {
    const formerName = name;
    if (checkPlatform === true) {
      name += DEFINES.IS_WIN ? '.win32' : '.unix';
    }
    if (!_.has(this.configs, name)) {
      name = formerName;
    }
    return _.get(this.configs, name, defValue);
  }

  /**
   * Returns the value of the configuration property. If the given property name has no value, then it lookup into
   * the settings object.
   *
   * @param {String} name
   * @param {*} defValue
   * @return {*|null|String}
   */
  getConfigOrSetting(name, defValue) {
    if (_.has(this.configs, name)) {
      return _.get(this.configs, name, defValue);
    }
    name = 'settings.' + name;
    return _.get(this.configs, name, defValue);
  }

  /**
   * Adjust and expand the value.
   *
   * @param {string} value the value for adjust
   * @return {string} the expended value
   */
  parseValue(value) {
    const that = this;
    if (_.isString(value)) {
      return value.replace(/\{([a-zA-Z.]+)\}/g, function (text, key) {
        key = key || '';
        switch (key.toLowerCase()) {
          case 'user.home':
            return DEFINES.USER_HOME_PATH;
          case 'project.home':
            return DEFINES.PROJECT_PATH;
          case 'server.home':
            return that.parseValue(that.getConfigOrSetting('server.home', ''));
          case 'domain.name':
            return that.getConfigOrSetting('domain.name', 'domain1');
          case 'domain.home':
            return that.parseValue(that.getConfig('domain.home', DEFINES.PROJECT_PATH));
          case 'project.version':
          case 'version':
            return that.getConfig('version', '0.0.0');
          case 'project.name':
          case 'name':
            return that.getConfig('name', text);
          case 'maven.home':
          case 'ant.home':
            return that.getConfigOrSetting(key, '-');
          default:
            // lookup in the settings
            const settingKey = 'settings.' + key;
            return that.parseValue(that.getConfig(settingKey, key));
        }
      });
    }
    return value;
  }

  /**
   * Returns the environment merging from the server configuration and the user environment file.
   *
   * @return {Object} the environment
   */
  getEnvironment() {
    return _.get(this.configs, 'env', {});
  }

  isVerbose() {
    return this.params.verbose;
  }

  isQuite() {
    return this.params.quiet;
  }

  /**
   * Writes the debug message to the console
   *
   * @param {String} message the message pattern
   * @param {*...} [args] the arguments for the message pattern
   * @return {Options}
   */
  logDebug(message, args) {
    if (this.params.verbose === true) {
      console.log('[%s] %s: %s', _logTimestamp('debug'), this.getAction(), _logMessage(arguments));
    }
    return this;
  }

  /**
   * Writes the info message to the console
   *
   * @param {String} message the message pattern
   * @param {*...} [args] the arguments for the message pattern
   * @return {Options}
   */
  logInfo(message, args) {
    if (!this.params.quiet) {
      console.log('[%s] %s: %s', _logTimestamp('info'), this.getAction(), _logMessage(arguments));
    }
    return this;
  }

  /**
   * Writes the warn message to the console
   *
   * @param {String} message the message pattern
   * @param {*...} [args] the arguments for the message pattern
   * @return {Options}
   */
  logWarn(message, args) {
    console.log('[%s] %s: %s', _logTimestamp('warn'), this.getAction(), _logMessage(arguments));
    return this;
  }

  /**
   * Writes the error message to the console
   *
   * @param {String} message the message pattern
   * @param {*...} [args] the arguments for the message pattern
   * @return {Options}
   */
  logError(message, args) {
    console.log('[%s] %s: %s', _logTimestamp('error'), this.getAction(), _logMessage(arguments));
    return this;
  }

  /**
   * Writes the info message.
   *
   * @param {String} message the message pattern
   * @param {*...} [args] the arguments for the message pattern
   * @return {Options}
   */
  log(message, args) {
    console.log('[%s] %s: %s', _logTimestamp('info'), this.getAction(), _logMessage(arguments));
    return this;
  }

  /**
   * Returns the plugin registry
   *
   * @return {Registry}
   */
  getRegistry() {
    return this.registry;
  }

}

/**
 * @param {Parameters} params
 * @param {Object} configs
 * @param {Registry} registry
 * @return {Options}
 */
module.exports.newOptions = function (params, configs, registry) {
  if (_.has(configs, 'plugins')) {
    _.omit(configs, 'plugins');
  }
  return new Options(params, configs, registry)
};

/**
 *
 * @param {Parameters} params
 * @param {Options} options
 * @return {Options}
 */
module.exports.copyOptions = function (params, options) {
  return new Options(params, options.configs, options.registry);
};

//
// Internal Implementation
//

function _logMessage(listOfArgs) {
  const args = Array.prototype.slice.call(listOfArgs);
  switch (args.length) {
    case 0: // nothing ??
      return '';
    case 1: // message
      return args[0];
    default: // message + args
      return util.format.apply(util, args);
  }
}

function _logTimestamp(level) {
  const timestamp = moment().format('HH:mm:ss.SSS');
  switch (level) {
    default:
    case 'debug':
      return colors.debug(timestamp);
    case 'info':
      return colors.info(timestamp);
    case 'warn':
      return colors.warn(timestamp);
    case 'error':
      return colors.error(timestamp);
  }
}
