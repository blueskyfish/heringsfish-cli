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
 * @name PipelineAction
 * @property {String} action the plugin / action name
 * @property {String} description a short description
 * @property {Array<String>} params an array with the parameter for the pipeline action.
 */


/**
 *
 * @param {Options} options
 * @return {Promise<Object>}
 */
module.exports = function (options) {

  const registry = options.getRegistry();
  const action   = options.getAction();
  const plugin   = registry.getPlugin(action);

  // get the action list of the pipeline
  const actionListOfPipeline = plugin.getSetting('pipeline', null);

  if (!_.isArray(actionListOfPipeline)) {
    return Promise.reject({
      code: 0xffff2a1,
      message: util.format('Plugin "%s" missing pipeline', action)
    });
  }

  if (options.isVerbose()) {
    options.logDebug('Pipeline (%s)', _.size(actionListOfPipeline));
    _.forEach(actionListOfPipeline, (pipeline) => {
      options.logDebug('> Pipe "%s" -> %s', pipeline.action || '??', pipeline.description || '??');
    });
  }

  if (options.isParam('try', 'test')) {

    options.logInfo('Plugin "%s" is trying the pipe action', action);
    _.forEach(actionListOfPipeline, (pipeline) => {
      options.logInfo('> Pipe "%s" @ params(%s)', pipeline.action,
        (_.isArray(pipeline.params) ? pipeline.params : []).join(' ')
      );
    });

    return Promise.resolve({
      message: util.format('Plugin "%s" is only try. Remove parameter "try" or "test"...', action)
    });
  }

  // process action one after the other
  let context = {
    finished: [],
    startTime: Date.now()
  };
  return _processActionList(options, actionListOfPipeline, context);
};


/**
 * Process every action in the pipeline action one after the other
 *
 * **Error**
 *
 * | Error    | Description
 * |----------|------------------------------
 * | 0xffce01 | Pipeline list does not contain action
 * | 0xffce02 | Plugin "x" is missing
 *
 * @param {Options} options the options
 * @param {Array<PipelineAction>} actionList
 * @param {Object} context contains
 * @return {Promise<*>}
 * @private
 */
function _processActionList(options, actionList, context) {

  if (_.size(actionList) === 0) {
    // the action list is empty -> exit the recursion
    return Promise.resolve({
      exitCode: 0,
      message: [
        util.format('finished action: ', context.finished.join(' ')),
        util.format('action "%s" is finish', options.getAction())
      ],
      duration: Date.now() - context.startTime
    });
  }

  /** @type {PipelineAction} */
  const item = actionList.shift();
  if (!_.isString(item.action)) {
    return Promise.reject({
      code: 0xffce01,
      message: util.format('Pipeline list does not contain action')
    });
  }

  const registry = options.getRegistry();
  const plugin = registry.getPlugin(item.action);
  if (typeof plugin !== 'object') {
    return Promise.reject({
      code: 0xffce02,
      message: util.format('Plugin "%s" is missing', item.action)
    });
  }

  const args = [item.action].concat((item.params || []));
  const newParams = utils.parseArguments(args);
  const newOptions = options.createCopy(newParams);

  newOptions.logInfo('Start "%s" (%s) ...', plugin.getName(), plugin.getDescription());

  return plugin.execute(newOptions)
    .then((runResult) => {

      newOptions.logInfo('Finish pipeline "%s" in %s ms -> exitCode %s', plugin.getName(), runResult.duration || '?', runResult.exitCode || '0');
      context.finished.push(plugin.getName());

      if (runResult.exitCode && runResult.exitCode > 0) {
        return Promise.reject(runResult);
      }

      newOptions.logInfo('call next pipeline action');
      return _processActionList(options, actionList, context);
    });
}
