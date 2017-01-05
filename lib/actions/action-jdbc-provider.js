/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 *
 * Purpose:
 * This is the main action for all other "jdbc" sub action.
 */

'use strict';

const util = require('util');

const Q = require('q');

const logger   = require('lib/logger');
const settings = require('lib/settings');

/**
 * @type {ActionInfo}
 */
const mInfo = {
  action: 'jdbc',
  description: 'JDBC Manager for Glassfish / Payara'
};

/**
 * @type {ActionProvider}
 */
module.exports = {

  run: function () {
    return run_();
  },

  info: function () {
    return mInfo;
  }
};

function run_() {
  // get sub action
  var subAction = settings.getSetting(0, 'list');
  var jdbcName = settings.getSettingByNames('n', 'name', null);

  subAction = subAction.toLowerCase();

  logger.debug('Execute sub action "%s"', subAction);

  switch (subAction) {
    case 'list':
    case 'create':
    case 'delete':
    case 'ping':
      return _loadAndExecute(subAction, jdbcName);
    default:
      return Q.reject({
        exitCode: 1,
        message: 'missing or unknown sub action'
      });
  }
}

/**
 * @param {string} subAction
 * @param {string} [jdbcName]
 * @return {promise}
 * @private
 */
function _loadAndExecute(subAction, jdbcName) {
  try {
    var requireName = util.format('./jdbc-%s-provider', subAction);
    var provider = require(requireName);
    return provider.run(jdbcName);
  }
  catch (e) {
    return Q.reject({
      exitCode: 1,
      message: e.message || util.format('could not execute "%s"', subAction)
    });
  }
}
