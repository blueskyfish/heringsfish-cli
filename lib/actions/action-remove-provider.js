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
  action: 'remove',
  description: 'Delete the application server domain'
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
    return asadmin.getAsAdminSettingValues()
      .then(
        function (asAdminSetting) {
          logger.info('Delete domain "%s"...', asAdminSetting.domainName);
          // build parameters
          var params = [
            'delete-domain',
            '--domaindir', asAdminSetting.domainHome,
            asAdminSetting.domainName
          ];

          if (config.isVerbose()) {
            logger.info('AsAdmin (%s %s)', asAdminSetting.asadmin, params.join(' '));
          }
          return runner.execute(asAdminSetting.asadmin, params);
        }
      );
  });
}
