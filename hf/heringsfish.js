/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/heringsfish
 *
 */

const util   = require('util');

const _      = require('lodash');
const colors = require('colors');

colors.setTheme({
  debug: 'green',
  info:  'blue',
  warn:  'magenta',
  error: 'red'
});


/**
 * Initialize the heringsfish app.
 *
 * @param {String} appHomePath the path to the heringsfish application
 * @param {String} projectHomePath the project home path
 * @param {Array<String>} args the program arguments
 * @return {Promise<Options>}
 */
module.exports.init = function (appHomePath, projectHomePath, args) {

  const that = this;

  // update and initialize the definitions
  const DEFINES  = require('hf/defines');

  DEFINES.PROJECT_PATH = projectHomePath;
  DEFINES.APPLICATION_PATH = appHomePath;

  const startup        = require('hf/kernel/startup');
  const optionModule   = require('hf/kernel/options');
  const registryModule = require('hf/kernel/registry');
  const utils          = require('hf/core/utils');

  // parse the parameters and reads the server configuration
  const params   = utils.parseArguments(args);
  const pkg      = startup.readAppPackage(appHomePath);

  return startup.readConfiguration(appHomePath, projectHomePath, DEFINES.USER_HOME_PATH)
    .then(function (configs) {

      const registry = registryModule.newRegistry(_.get(configs, 'plugins', {}));
      const options  = optionModule.newOptions(params, configs, registry);

      // app instance
      Object.defineProperty(that, 'options', {
        enumerable: true,
        value: options,
        configurable: true
      });

      return options
        .log('')
        .log('%s (%s)', pkg.title, pkg.version)
        .log('')
        .log('Project: %s', options.getConfig('name', utils.getDefaultProjectName()))
        .log('Version: %s', options.getConfig('version', '0.0.0'))
        .log('Home:    %s', projectHomePath)
        .log('')
        .log('User:    %s', DEFINES.USER_HOME_PATH)
        .log('HF Path: %s', appHomePath)
        .log('');
    });
};

/**
 * The executor try to load and execute a plugin.
 *
 * **Errors**
 *
 * In case of errors the promise reject is calling with this error messages:
 *
 * | Error     | Message
 * |-----------|------------------------------------------------
 * | 0xff0001  | Plugin "x" is missing in the plugin registry
 * | 0xff0002  | Plugin "x" requires a path
 * | 0xff0003  | Plugin "x" could not load [error.message]
 * | 0xff0004  | Plugin "x" is not valid
 *
 * @param {Options} options the options
 * @return {Promise<Object>}
 */
module.exports.execute = function (options) {
  // get plugin registry
  const registry = options.getRegistry();

  if (options.isVerbose()) {
    options.logDebug('Plugin Registry (%s)', registry.size());
    registry.forEach((name, plugin) => {
      options.logDebug(' > Plugin: %s -> %s', name, plugin.getDescription() || name);
    });
  }

  const action = options.getAction();

  if (!registry.hasPlugin(action)) {
    return Promise.reject({
      code: 0xff0001,
      message: util.format('Plugin "%s" is missing in the PluginRegistry', action)
    });
  }

  const plugin = registry.getPlugin(action);
  if (typeof plugin !== 'object') {
    return Promise.reject({
      code: 0xff0002,
      message: util.format('Plugin "%s" is missing', action)
    });
  }

  options.logDebug('Load "%s"', plugin.toString());

  return plugin.execute(options);
};

/**
 * Shows the success message.
 *
 * @param {Object} result
 */
module.exports.success = function (result) {
  const that = this;

  if (!that.options) {
    console.error(JSON.stringify(result));
    return;
  }
  const options = that.options;

  if (result && result.message) {
    if (_.isArray(result.message)) {
      _.forEach(result.message, (line) => {
        options.logInfo(line);
      })
    } else {
      options.logInfo(result.message);
    }
  }
  if (result && result.duration) {
    options.logInfo('Duration: %s ms', result.duration);
  }

  // exit code 0 !
  process.exit(0);

};

/**
 * Shows the error messages
 *
 * @param {Object} reason
 */
module.exports.failure = function (reason) {
  const that = this;

  if (!that.options) {
    throw new Error(result);
  }
  const options = that.options;

  // show the error message
  if (reason && reason.message) {
    if (_.isArray(reason.message)) {
      _.forEach(reason.message, (line) => {
        options.logError(line);
      })
    } else {
      options.logError(reason.message);
    }
  }
  if (reason && reason.code) {
    options.logError('Code: 0x%s', reason.code.toString(16));
  }
  if (reason && reason.stack) {
    options.logError('Stack: %s', reason.stack);
  }
  if (reason && reason.duration) {
    options.logError('Duration: %s ms', reason.duration);
  }

  // exit code -> reason.existCode
  const exitCode = reason.exitCode || 1;
  process.exit(exitCode);

};
