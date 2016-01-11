/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var Q = require('q');

var logger = require('../logger');
var runner = require('../runner');

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'start',
  description: 'Starts the Glassfish / Payara domain'
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
          logger.info('Starts domain "%s" ...', asAdminSetting.domainName);
          // build parameters
          var params = [
            'start-domain',
            '--domaindir', asAdminSetting.domainHome,
            '--debug=true',
            asAdminSetting.domainName
          ];
          return runner.execute(asAdminSetting.asadmin, params);
        }
      );
  });
}

