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
 * Try to show the help text from the given second action / plugin
 *
 * @requires path
 * @requires util
 * @requires lodash
 * @requires q
 * @requires module:hf/defines
 * @requires module:hf/core/io
 */

const path    = require('path');
const util    = require('util');

const _       = require('lodash');
const Q       = require('q');

const DEFINES = require('hf/defines');
const io      = require('hf/core/io');

/**
 * Try to execute the help action and shows the help text to the requested plugin (action)
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  return new Promise(function _executeHelp (resolve, reject) {
    const startTime  = Date.now();

    // get the second action
    const helpAction = _prepareActionHelp(options.getParam(0, null));

    const pluginRegistry = options.getConfig('plugins', {});

    options.logDebug('Help search for plugin "%s"', helpAction);

    if (!pluginRegistry[helpAction]) {
      return reject({
        code: 0xff0011,
        message: util.format('Plugin "%s" is missing', helpAction)
      });
    }

    const pluginHelpPath = pluginRegistry[helpAction].help || null;

    if (!pluginHelpPath) {
      return reject({
        code: 0xff0012,
        message: util.format('Plugin "%s" has no help text', helpAction)
      });
    }

    // first: try read the help text from the application plugin
    return io.readContent(path.join(DEFINES.APPLICATION_PATH, pluginHelpPath))
      .then(function (content) {
        if (!content) {
          // second: try to read the help text from the project path
          return io.readContent(path.join(DEFINES.PROJECT_PATH, pluginHelpPath));
        }
        return content;
      })
      .then(function (content) {

        const lines = _.isString(content) ? content.split('\n') : [];
        if (_.size(lines) > 0) {
          options.logInfo('-------------------------------------------------------------------------------')
        }
        _.forEach(lines, function (line) {
          options.logInfo(line);
        });
        if (_.size(lines) > 0) {
          options.logInfo('-------------------------------------------------------------------------------')
        }
        options.logInfo('');

        resolve({
          exitCode: 0,
          message: util.format('Plugin "%s" shows help text', helpAction),
          duration: Date.now() - startTime
        });

      }, function (reason) {
        reject({
          code: 0xff0013,
          message: util.format('Plugin "%s" helping has occurred an error (%s)', helpAction, reason.message || '??'),
          stack: reason.stack || null
        });
      });
  });
};

function _prepareActionHelp(helpAction) {
  if (_.isString(helpAction)) {
    return helpAction.replace(/ /g, '-').toLowerCase();
  }
  return 'help';
}
