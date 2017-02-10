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
 */

const util     = require('util');

const _        = require('lodash');

const utils    = require('hf/core/utils');


/**
 *
 * @param {Options} options
 * @return {Promise<Object>}
 */
module.exports = function (options) {

  const registry = options.getRegistry();
  const action   = options.getAction();
  const plugin   = registry.getPlugin(action);
  const pipeline = plugin.getSetting('pipeline', null);

  if (!_.isArray(pipeline)) {
    return Promise.reject({
      code: 0xffff2a1,
      message: util.format('Plugin "%s" missing pipeline', action)
    });
  }

  if (options.isVerbose()) {
    options.logDebug('Pipeline (%s)', _.size(pipeline));
    _.forEach(pipeline, (pipeline) => {
      options.logDebug('> Pipe "%s" -> %s', pipeline.action || '??', pipeline.description || '??');
    });
  }

  if (options.isParam('try', 'test')) {

    options.logInfo('Plugin "%s" is trying the pipe action', action);
    _.forEach(pipeline, (pipeline) => {
      options.logInfo('> Pipe "%s" @ params(%s)', pipeline.action,
        (_.isArray(pipeline.params) ? pipeline.params : []).join(' ')
      );
    });

    return Promise.resolve({
      message: util.format('Plugin "%s" is only try. Remove parameter "try" or "test"...', action)
    });
  }

  return Promise.reject({
    message: util.format('Pipe: "%s" is not implemented yet!', action)
  });
};

