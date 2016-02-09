/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';


var Q = require('q');

var logger = require('../logger');
var settings = require('../settings');
var runner = require('../runner');
var utilities = require('../utilities');


module.exports = {

  /**
   * Starts the maven build project.
   * @return {Q.promise}
   */
  buildProject: function () {
    return buildProject_();
  },

  /**
   * Deploy an application
   *
   * @param {AsAdminSetting} asAdminSetting
   * @param {string} appName the application name
   * @param {string} filename the filename of the java archive (war, ear or jar)
   * @return {Q.promise}
   */
  deployApplication: function (asAdminSetting, appName, filename) {
    return deployApplication_(asAdminSetting, appName, filename);
  },

  /**
   * Undeploy and remove an application from the server.
   *
   * @param {AsAdminSetting} asAdminSetting
   * @param {string} appName
   */
  undeployApplication: function (asAdminSetting, appName) {
    return undeployApplication_(asAdminSetting, appName);
  }

};

function buildProject_() {
  return runner.getMavenSettingValues()
    .then(function (mavenSetting) {
      // mvn -f ./projects/pom.xml package -DskipTests=true
      var params = [
        '-f', mavenSetting.project
      ];
      if (mavenSetting.setting) {
        params.push('-s', mavenSetting.setting);
      }
      // goals
      if (settings.isSetting('c', 'clean')) {
        // add clean goal to the build parameters
        params.push('clean');
      }
      // add package goal
      params.push('package');
      if (settings.getSetting('skip', false)) {
        // skip the execution of test cases.
        params.push('-DskipTests=true');
      }
      // profiles
      var profiles = settings.getSettingByNames('p', 'profile', null);
      if (profiles) {
        // add profile(s)
        params.push('-P', profiles);
      }
      if (settings.isVerbose()) {
        logger.debug('%s %s', mavenSetting.maven, JSON.stringify(params));
      }

      return runner.execute(mavenSetting.maven, params);
    });
}

function deployApplication_(asAdminSetting, appName, filename) {
  logger.info('try to deploy "%s" (%s) on domain "%s" ...',
    appName, utilities.shortPathName(filename), asAdminSetting.domainName
  );
  return utilities.exists(filename)
    .then(function (fileExist) {
      if (!fileExist) {
        return Q.reject(utilities.error(null, 'File "%s" is not exist! Could not deploy "%s"!',
          utilities.shortPathName(filename), appName
        ));
      }
      // ${ASADMIN} deploy --port ${DOMAIN_ADMIN_PORT} --force=true --name=${APP_COMP_NAME} ${APP_FILE}
      var params = [
        'deploy',
        '--port', asAdminSetting.adminPort,
        '--force=true',
        '--name=' + appName,
        filename
      ];
      return runner.execute(asAdminSetting.asadmin, params)
        .then(function (executeMessage) {
          // extends with the appName and filename!
          executeMessage.appName = appName;
          executeMessage.filename = utilities.shortPathName(filename);

          return executeMessage;
        });
    });
}

function undeployApplication_(asAdminSetting, appName) {
  logger.info('try to undeploy "%s" on domain "%s" ...', appName, asAdminSetting.domainName);
  // ${ASADMIN} undeploy --port ${DOMAIN_ADMIN_PORT} --cascade=true ${APP_COMP_NAME}
  var params = [
    'undeploy',
    '--port', asAdminSetting.adminPort,
    '--cascade=true',
    appName
  ];
  return runner.execute(asAdminSetting.asadmin, params)
    .then(function (executeMessage) {
      executeMessage.appName = appName;
      return executeMessage;
    });
}
