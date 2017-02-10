/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/init
 * @description
 * Initialize the heringsfish server configuration in the current project home directory
 *
 * @requires path
 * @requires lodash
 * @requires module:hf/defines
 * @requires module:hf/core/io
 * @requires module:hf/core/utils
 * @requires module:hf/core/os
 */

const path     = require('path');

const _        = require('lodash');

const DEFINES  = require('hf/defines');
const io       = require('hf/core/io');
const utils    = require('hf/core/utils');
const os       = require('hf/core/os');

/**
 * Try to initial the heringsfish server configuration.
 *
 * **Errors**
 *
 * | Error     | Description
 * |-----------|--------------------------
 * | 0xff0101  | Unclear instructions! Should never happens
 *
 * @param {Options} options
 * @return {Promise}
 */
module.exports = function (options) {
  const serverConfigFilename = path.join(DEFINES.PROJECT_PATH, DEFINES.SERVER_CONFIG_FILENAME);
  return io.hasFile(serverConfigFilename)
    .then((fileExist) => {
      return _chooseOverride(options, fileExist);
    })
    .then((result) => {
      // write information
      options.logInfo('Initialize the server configuration for "%s"', utils.getDefaultProjectName());

      switch (result) {
        case DEFINES.DO_OVERRIDE:
          options.logInfo('Override the existed server-config.json file');
          return true;
        case DEFINES.DO_CREATION:
          options.logInfo('Create the server-config.json file');
          return true;
        default:
          return Promise.reject({
            code: 0xff0101,
            message: 'Unclear instructions! Should never happens'
          });
      }
    })
    .then(() => {
      const templateFilename = path.join(DEFINES.APPLICATION_PATH, 'hf', 'templates', 'server-config.json');
      return io.readJson(templateFilename, true);
    })
    .then((configs) => {
      return _enrichServerConfiguration(options, configs);
    })
    .then(function (configs) {
      return io.writeFile(serverConfigFilename, configs);
    })
    .then(function (result) {

      options.logInfo('')
        .logInfo('The server config is written to "%s"', serverConfigFilename)
        .logInfo('Please adjust the configuration to your needs')
        .logInfo('')
        .logInfo('Here a list of possible adjustments:')
        .logInfo('- set the project name')
        .logInfo('- set the project version')
        .logInfo('- config the server home path')
        .logInfo('- set the Maven home path when you use Maven')
        .logInfo('- set the Ant home path when you use Ant')
        .logInfo('- set the timeout for the external commands (0 is infinity)')
        .logInfo('- config the jdbc')
        .logInfo('- config the project settings object')
        .logInfo('- config the user settings file')
        .logInfo('')
        .logInfo('More information at')
        .logInfo('  "https://blueskyfish.github.io/heringsfish-cli/config/server-config.html"');

      return result;
    })
};


//
// Internal Functions
//

/**
 *
 * @param {Options} options
 * @param {Boolean} fileExist
 * @return {Promise<Boolean>}
 * @private
 */
function _chooseOverride(options, fileExist) {
  if (fileExist) {
    if (options.isParam('f', 'force')) {
      return Promise.resolve(DEFINES.DO_OVERRIDE);
    }
    return Promise.reject({
      exitCode: 0,
      message: [
        'There is already a configuration available.',
        'If you want to overwrite this, use the parameter "-f" or "--force"'
      ]
    });
  }
  return Promise.resolve(DEFINES.DO_CREATION);
}

/**
 * Enrich the configuration with the commands and the project information
 *
 * @param {Options} options
 * @param {Object} configs the template configuration
 * @return {Promise.<Object>} the configuration
 * @private
 */
function _enrichServerConfiguration(options, configs) {

  options.logDebug('Lookup for "asadmin", "mvn" and "ant"');

  // set the project name
  _.set(configs, 'name', utils.getDefaultProjectName());

  // lookup for the commands
  const asAdminPromise = os.findCommand(options, 'asadmin');
  const mavenPromise   = os.findCommand(options, 'mvn');
  const antPromise     = os.findCommand(options, 'ant');

  return Promise.all([asAdminPromise, mavenPromise, antPromise])
    .then((list) => {
      _.forEach(list, (result) => {
        // Assumption:
        // The application is assumed to be in a bin directory.
        // This removes the file name and the bin directory to get the home directory
        if (result.asadmin) {
          options.logInfo('Found "asAdmin": %s', result.asadmin);
          return _.set(configs, 'settings.server.home', utils.adjustCommandHomePath(result.asadmin));
        }
        if (result.mvn) {
          options.logInfo('Found "mvn": %s', result.mvn);
          return _.set(configs, 'settings.maven.home', utils.adjustCommandHomePath(result.mvn));
        }
        if (result.ant) {
          options.logInfo('Found "ant": %s', result.ant);
          return _.set(configs, 'settings.ant.home', utils.adjustCommandHomePath(result.ant));
        }
      });
      return configs;
    });
}
