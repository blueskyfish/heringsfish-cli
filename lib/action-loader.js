#!/usr/bin/env node

/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');

var _ = require('lodash');
var Q = require('q');

var logger = require('./logger');
var settings = require('./settings');
var utilities = require('./utilities');

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

  logger.debug('Lookup to file "%s"', utilities.shortPathName(filename));

  fs.stat(filename, function (err) {

    if (err) {
      return done.reject(utilities.error(err, 'file %s not found!', utilities.shortPathName(filename)));
    }
    var provider;
    try {
      /** @type {ActionProvider} */
      provider = require(filename);
    } catch (e) {
      logger.error(e.stack);
      return done.reject(utilities.error(e, 'file %s could not read!', utilities.shortPathName(filename)));
    }

    if (!_.isFunction(provider.run)) {
      return done.reject(utilities.error(null, 'action provider "%s" should have function run()!', action));
    }
    if (!_.isFunction(provider.info)) {
      return done.reject(utilities.error(null, 'action provider "%s" should have function info()!', action))
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