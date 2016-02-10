/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

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
  if (!settings.getSetting('nobuild', false)) {
    mavenRunner = composed.buildProject();
  }
  return runner.getAsAdminSettingValues(true)
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
  var appName = settings.getSetting(0, null);
  if (appName) {
    // deploy one singleton application
    var appNameProperty = utilities.adjustPropertyName(appName);
    var filename = configure.get('domain.deploy.' + appNameProperty, null);
    if (!filename) {
      return Q.reject(utilities.error(null, 'Missing for "%s" the java archive', appName));
    }
    filename = configure.adjustValue(filename);
    return composed.deployApplication(asAdminSetting, appNameProperty, filename)
      .then(function (successMessage) {
        successMessage.duration = (Date.now() - startTime);
        return successMessage;
      });
  }
  // deploy all applications
  var appList = configure.get('domain.deploy', {});
  if (_.size(appList) == 0) {
    return Q.reject(utilities.error(null, 'There are no applications for deployment!'));
  }

  var appPromiseList = [];

  _.forEach(appList, function (filename, appName) {
    var appNameProperty = utilities.adjustPropertyName(appName);
    var adjustFilename = configure.adjustValue(filename);

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