/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const util = require('util');

const _ = require('lodash');
const Q = require('q');

const configure = require('lib/configure');
const logger    = require('lib/logger');
const runner    = require('lib/runner');
const settings  = require('lib/settings');

const builder   = require('lib/core/builder');

const composed  = require('lib/actions/composed');

/**
 * @type {ActionInfo}
 */
const mInfo = {
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
        var appNameProperty = builder.adjustPropertyName(appName);

        return composed.undeployApplication(asAdminSetting, appNameProperty)
          .then(function (executeMessage) {
            executeMessage.duration = (Date.now() - startTime);
            executeMessage.appName = appNameProperty;
          });
      }
      // undeploy all applications
      var appList = configure.get('domain.deploy', {});
      if (_.size(appList) == 0) {
        return Q.reject(builder.createError(null, 'There are no applications for removing!'));
      }

      var appPromiseList = [];

      _.forEach(appList, function (filename, appName) {
        var appNameProperty = builder.adjustPropertyName(appName);

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
