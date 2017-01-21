/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/help
 * @description
 */

const path     = require('path');
const util     = require('util');

const DEFINES  = require('hf/defines');
const io       = require('hf/core/io');

const OVERRIDE = 1;
const CREATE   = 2;

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
    .then(function (fileExist) {
      return _chooseOverride(options, fileExist);
    })
    .then(function (result) {
      if (options.isVerbose()) {
        switch (result) {
          case OVERRIDE:
            options.logDebug('Override the existed server-config.json file');
            return true;
          case CREATE:
            options.logDebug('Create the server-config.json file');
            return true;
          default:
            return Promise.reject({
              code: 0xff0101,
              message: 'Unclear instructions! Should never happens'
            });
        }
      }
      return true;
    })
    .then(function () {
      const templateFilename = path.join(DEFINES.APPLICATION_PATH, 'hf', 'templates', 'server-config.json');
      return io.readFile(templateFilename, true);
    })
    .then(function (content) {
      return io.writeFile(serverConfigFilename, content);
    })
    .then(function (result) {
      options.logInfo('');
      options.logInfo('The server config is written to "%s"', serverConfigFilename);
      options.logInfo('Please adjust the configuration to your needs');
      options.logInfo('');
      options.logInfo('Here a list of possible adjustments:');
      options.logInfo('- set the project name');
      options.logInfo('- set the project version');
      options.logInfo('- config the server home path');
      options.logInfo('- set the Maven home path when you use Maven');
      options.logInfo('- set the Ant home path when you use Ant');
      options.logInfo('- set the timeout for the external commands (0 is infinity)');
      options.logInfo('- config the jdbc');
      options.logInfo('- config the project settings object');
      options.logInfo('- config the user settings object');
      options.logInfo('');
      options.logInfo('More information at');
      options.logInfo('  "https://blueskyfish.github.io/heringsfish-cli/configuration.html"');
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
      return Promise.resolve(OVERRIDE);
    }
    return Promise.reject({
      exitCode: 0,
      message: 'Existed server config file. Use parameter "-f" for override it'
    });
  }
  return Promise.resolve(CREATE);
}

