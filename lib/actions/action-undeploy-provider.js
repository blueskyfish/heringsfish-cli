/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

var util = require('util');

var _ = require('lodash');
var Q = require('q');

var configure = require('../configure');
var logger = require('../logger');
var runner = require('../runner');
var settings = require('../settings');
var utilities = require('../utilities');

var composed = require('./composed');

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'undeploy',
  description: 'Undeploy and remove the application from the application server.'
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
  var startTime = Date.now();
  logger.info('Execute "%s" (%s)', mInfo.action, mInfo.description);
  return runner.getAsAdminSettingValues(true)
    .then(function (asAdminSetting) {
      var appName = settings.getSetting(0, null);
      if (appName) {
        // deploy one singleton application
        var appNameProperty = utilities.adjustPropertyName(appName);

        return composed.undeployApplication(asAdminSetting, appNameProperty)
          .then(function (executeMessage) {
            executeMessage.duration = (Date.now() - startTime);
            executeMessage.appName = appNameProperty;
          });
      }
      // undeploy all applications
      var appList = configure.get('domain.deploy', {});
      if (_.size(appList) == 0) {
        return Q.reject(utilities.error(null, 'There are no applications for removing!'));
      }

      var appPromiseList = [];

      _.forEach(appList, function (filename, appName) {
        var appNameProperty = utilities.adjustPropertyName(appName);

        appPromiseList.push(composed.undeployApplication(asAdminSetting, appNameProperty));
      });

      // prepare the result
      return Q.all(appPromiseList)
        .then(function (resultList) {

          var result = {
            duration: (Date.now() - startTime),
            exitCode: 0,
            appNames: []
          };

          _.forEach(resultList, function (executeMessage) {
            logger.debug('undeploy "%s" in %s ms', executeMessage.appName, executeMessage.duration);
            result.appNames.push(executeMessage.appName);
          });

          return result;
        })
    });
}
