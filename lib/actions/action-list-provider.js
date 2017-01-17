/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const Q = require('q');

const config   = require('lib/config');
const logger   = require('lib/logger');
const runner   = require('lib/runner');
const asadmin  = require('lib/server/asadmin');

/**
 * @type {ActionInfo}
 */
const mInfo = {
  action: 'list',
  description: 'List the domains or application'
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
  return Q.fcall(function () {
    logger.info('Execute "%s" (%s)', mInfo.action, mInfo.description);

    return asadmin.getAsAdminSettingValues(true)
      .then(function (asAdminSetting) {
        if (config.isSetting('d', 'domain')) {
          return _executeDomainList(asAdminSetting);
        }
        return _executeApplicationList(asAdminSetting);
      });
  });
}

function _executeDomainList(asAdminSetting) {
  // build parameters
  var params = [
    'list-domains',
    '--domaindir', asAdminSetting.domainHome
  ];
  return runner.execute(asAdminSetting.asadmin, params);
}

function _executeApplicationList(asAdminSetting) {
  var params = [
    'list-applications',
    '--port', asAdminSetting.adminPort
  ];
  return runner.execute(asAdminSetting.asadmin, params);
}
