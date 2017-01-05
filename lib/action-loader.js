/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const _ = require('lodash');
const Q = require('q');

const logger   = require('lib/logger');
const settings = require('lib/settings');
const builder  = require('lib/core/builder');

module.exports = {

  /**
   * @description
   * Try to load the action provider. In case of success the promise.then part has the Parameter ActionProvider.
   *
   * ```js
   * var actionLoader = require('./action-loader');
   * actionLoader('test').then(
   *   function (provider) {
   *     var actionInfo = provider.info();
   *     console.log('%s -> %s', actionInfo.action, actionInfo.description);
   *     return provider.run();
   *   }
   * );
   * ```
   *
   * @param {string} action
   * @return {Q.promise}
   */
  find: function (action) {
    return load_(action);
  }
};

/**
 * @param action
 * @return {Q.promise}
 * @private
 */
function load_(action) {
  return _loadAction(action || settings.getAction());
}

function _loadAction(action) {
  var done = Q.defer();
  var filename = path.join(__dirname, 'actions', util.format('action-%s-provider.js', action));

  logger.debug('Lookup to file "%s"', builder.shortPathName(filename));

  fs.stat(filename, function (err) {

    if (err) {
      return done.reject(builder.createError(err, 'file %s not found!', builder.shortPathName(filename)));
    }
    var provider;
    try {
      /** @type {ActionProvider} */
      provider = require(filename);
    } catch (e) {
      var error = e.stack || e;
      logger.error(error);
      return done.reject(builder.createError(e, 'file %s could not read!', builder.shortPathName(filename)));
    }

    if (!_.isFunction(provider.run)) {
      return done.reject(builder.createError(null, 'action provider "%s" should have function run()!', action));
    }
    if (!_.isFunction(provider.info)) {
      return done.reject(builder.createError(null, 'action provider "%s" should have function info()!', action))
    }

    logger.debug('Find the action provider: action="%s"; description="%s"',
      provider.info().action, provider.info().description
    );

    done.resolve(provider);
  });

  return done.promise;
}


/**
 * @class ActionProvider
 * @description Handle the action
 *
 * Interface
 *
 * ```js
 * interface ActionProvider {
 *   run(): Q.promise
 *   info(): ActionInfo
 * }
 * ```
 */

/**
 * @name run
 * @description Executes the action.
 * @memberOf ActionProvider
 * @return {Q.promise}
 */

/**
 * @name info
 * @description Returns the information about the action provider
 * @memberOf ActionProvider
 * @return {ActionInfo}
 */

/**
 * @name ActionInfo
 * @description Information for the action provider
 * @property {string} action
 * @property {string} description
 */
