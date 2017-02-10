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
 * @requires module:hf/defines
 * @requires module:hf/core/io
 */

const path    = require('path');
const util    = require('util');

const _       = require('lodash');

const DEFINES = require('hf/defines');
const io      = require('hf/core/io');

/**
 * Try to execute the help action and shows the help text to the requested plugin (action)
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {

  const registry   = options.getRegistry();
  const helpAction = _prepareActionHelp(options.getParam(0, null));

  if (!registry.hasPlugin(helpAction)) {
    return Promise.reject({
      code: 0xff0011,
      message: util.format('Plugin "%s" is missing', helpAction)
    });
  }

  const plugin = registry.getPlugin(helpAction);
  if (typeof plugin !== 'object') {
    return Promise.reject({
      code: 0xff0002,
      message: util.format('Plugin "%s" is missing', options.getAction())
    });
  }

  const pluginHelpPath = plugin.getHelpPath();

  return io.readContent(path.join(DEFINES.APPLICATION_PATH, pluginHelpPath))
    .then((content) => {
      if (!content) {
        // second: try to read the help text from the project path
        return io.readContent(path.join(DEFINES.PROJECT_PATH, pluginHelpPath));
      }
      return content;
    })
    .then((content) => {

      const lines = _.isString(content) ? content.split('\n') : [];
      if (_.size(lines) > 0) {
        options.logInfo('-------------------------------------------------------------------------------')
      }
      _.forEach(lines, (line) => {
        options.logInfo(line);
      });
      if (_.size(lines) > 0) {
        options.logInfo('-------------------------------------------------------------------------------')
      }
      options.logInfo('');

      return Promise.resolve({
        exitCode: 0,
        message: util.format('Plugin "%s" shows "%s" help', options.getAction(), helpAction)
      });

    })
    .catch((reason) => {
      return Promise.reject({
        code: 0xff0013,
        message: util.format('Plugin "%s" helping has occurred an error (%s)', helpAction, reason.message || '...'),
        stack: reason.stack || null
      });
    });
};

function _prepareActionHelp(helpAction) {
  if (_.isString(helpAction)) {
    return helpAction.replace(/ /g, '-').toLowerCase();
  }
  return 'help';
}
