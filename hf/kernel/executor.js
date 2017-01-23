/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/kernel/executor
 *
 */

const path    = require('path');
const util    = require('util');

const _       = require('lodash');

const io      = require('hf/core/io');


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
module.exports = function (options) {

  // get plugin registry
  const pluginRegistry = options.getConfig('plugins', {});

  if (options.isVerbose()) {
    options.logDebug('Plugin Registry (%s)', _.size(pluginRegistry));
    _.forEach(pluginRegistry, function (plugin, name) {
      options.logDebug(' > Plugin: %s -> %s', name, plugin.description || plugin.name || name);
    });
  }

  const action = options.getAction();

  if (!pluginRegistry[action]) {
    return Promise.reject({
      code: 0xff0001,
      message: util.format('Plugin "%s" is missing in the PluginRegistry', action)
    });
  }

  const pluginPath = pluginRegistry[action].path || null;
  if (!pluginPath) {
    return Promise.reject({
      code: 0xff0002,
      message: util.format('Plugin "%s" requires a path', action)
    });
  }

  options.logDebug('Load Plugin "%s" from "%s"', action, pluginPath);

  // try to load the plugin
  let pluginExecutor = null;
  try {
    pluginExecutor = require(pluginPath);
  } catch (e) {
    return Promise.reject({
      code: 0xff0003,
      message: util.format('Plugin "%s" could not load (%s)', action, e.message || '?'),
      stack: e.stack || null
    });
  }
  // validate the plugin
  if (!pluginExecutor || !_.isFunction(pluginExecutor)) {
    return Promise.reject({
      code: 0xff0004,
      message: util.format('Plugin "%s" is not valid', action)
    });
  }

  const pluginName = pluginRegistry[action].name || action;
  const pluginDescription = pluginRegistry[action].description || action;

  options.logInfo('');
  options.logInfo('Execute action "%s" @ "%s"', pluginName, pluginDescription);
  options.logInfo('');

  // executes the plugin
  const startTime = Date.now();
  return pluginExecutor(options)
    .then((result) => {
      result.duration = Date.now() - startTime;
      return result;
    }, (reason) => {
      reason.duration = Date.now() - startTime;
      return Promise.reject(reason);
    });
};
