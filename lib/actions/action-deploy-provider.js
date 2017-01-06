/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const _     = require('lodash');
const Q     = require('q');

const config   = require('lib/config');
const logger   = require('lib/logger');
const runner   = require('lib/runner');
const builder  = require('lib/core/builder');
const composed = require('lib/actions/composed');
const asadmin  = require('lib/server/asadmin');

/**
 * @type {ActionInfo}
 */
const mInfo = {
  action: 'deploy',
  description: 'Deploy the application files'
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
  logger.info('Execute "%s" (%s)', mInfo.action, mInfo.description);
  var startTime = Date.now();
  var mavenRunner = null;
  if (!config.getSetting('nobuild', false)) {
    mavenRunner = composed.buildProject();
  }
  return asadmin.getAsAdminSettingValues(true)
    .then(function (asAdminSetting) {
      if (mavenRunner) {
        return Q.all(mavenRunner).then(function (successMessage) {
          logger.debug('build project in %s ms', successMessage.duration || -1);
          return _executeDeployment(asAdminSetting, startTime);
        });
      }
      return _executeDeployment(asAdminSetting, startTime);
    });
}

function _executeDeployment(asAdminSetting, startTime) {
  var appName = config.getSetting(0, null);
  if (appName) {
    // deploy one singleton application
    var appNameProperty = builder.adjustPropertyName(appName);
    var filename = config.getConfig('domain.deploy.' + appNameProperty, null);
    if (!filename) {
      return Q.reject(builder.createError(null, 'Missing the java archive for "%s"', appName));
    }
    filename = config.parseValue(filename);
    return composed.deployApplication(asAdminSetting, appNameProperty, filename)
      .then(function (successMessage) {
        successMessage.duration = (Date.now() - startTime);
        return successMessage;
      });
  }
  // deploy all applications
  var appList = config.getConfig('domain.deploy', {});
  if (_.size(appList) == 0) {
    return Q.reject(builder.createError(null, 'There are no applications for deployment!'));
  }

  var appPromiseList = [];

  _.forEach(appList, function (filename, appName) {
    var appNameProperty = builder.adjustPropertyName(appName);
    var adjustFilename = config.parseValue(filename);

    appPromiseList.push(composed.deployApplication(asAdminSetting, appNameProperty, adjustFilename));
  });

  return Q.all(appPromiseList)
    .then(function (resultList) {

      var result = {
        duration: (Date.now() - startTime),
        exitCode: 0,
        appNames: [],
        filenames: []
      };

      _.forEach(resultList, function (executeMessage) {
        logger.debug('deploy "%s" in %s ms', executeMessage.appName, executeMessage.duration);
        result.appNames.push(executeMessage.appName);
        result.filenames.push(executeMessage.filename);
      });

      return result;
    });
}
