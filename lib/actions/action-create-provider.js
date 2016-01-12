/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var util = require('util');

var path = require('path');

var Q = require('q');

var logger = require('../logger');
var runner = require('../runner');
var settings = require('../settings');
var utilities = require('../utilities');

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'create',
  description: 'Create the domain for the application server'
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
    return runner.getAsAdminSettingValues(true)
      .then(
        function (asAdminSetting) {
          logger.info('Create domain "%s"...', asAdminSetting.domainName);
          // build parameters
          var params = [
            'create-domain',
            '--portbase', asAdminSetting.portBase,
            '--domaindir', asAdminSetting.domainHome,
            '--nopassword',
            asAdminSetting.domainName
          ];
          return runner.execute(asAdminSetting.asadmin, params);
        }
      );
  });
}
