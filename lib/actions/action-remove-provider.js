/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var Q = require('q');

var logger = require('../logger');
var runner = require('../runner');
var utilities = require('../utilities');

/**
 * @type {ActionInfo}
 */
var mInfo = {
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
    return runner.getAsAdminSettingValues()
      .then(
        function (asAdminSetting) {
          logger.info('Delete domain "%s"...', asAdminSetting.domainName);
          // build parameters
          var params = [
            'delete-domain',
            '--domaindir', asAdminSetting.domainHome,
            asAdminSetting.domainName
          ];
          return runner.execute(asAdminSetting.asadmin, params);
        }
      );
  });
}
