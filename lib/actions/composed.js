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
const builder  = require('lib/core/builder');
const ioThen   = require('lib/core/io-then');
const json     = require('lib/core/json');
const asadmin  = require('lib/server/asadmin');

module.exports = {

  /**
   * Starts the maven build project.
   * @return {Q.promise}
   */
  buildProject: function () {
    return buildProject_();
  },

  /**
   * Starts to test the project.
   *
   * @return {Q.promise}
   */
  testProject: function () {
    return testProject_();
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
  },

  /**
   * Start the application server
   *
   * @param {ActionInfo} info the action info
   * @return {Q.promise}
   */
  startServer: function (info) {
    return startServer_(info);
  },

  /**
   * Stop the application server.
   *
   * @param {ActionInfo} info the action info
   * @return {Q.promise}
   */
  stopServer: function (info) {
    return stopServer_(info);
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
      if (config.isSetting('c', 'clean')) {
        // add clean goal to the build parameters
        params.push('clean');
      }
      // add package goal
      params.push('package');
      if (config.getSetting('skip', false)) {
        // skip the execution of test cases.
        params.push('-DskipTests=true');
      }
      // profiles
      var profiles = config.getSettingByNames('p', 'profile', null);
      if (profiles) {
        // add profile(s)
        params.push('-P', profiles);
      }
      if (config.isVerbose()) {
        logger.info('Maven (%s %s)', mavenSetting.maven, params.join(' '));
      }

      return runner.execute(mavenSetting.maven, params);
    });
}

function testProject_() {
  return runner.getMavenSettingValues()
    .then(function (mavenSetting) {
      // mvn -f ./projects/pom.xml package
      var params = [
        '-f', mavenSetting.project
      ];
      if (mavenSetting.setting) {
        params.push('-s', mavenSetting.setting);
      }
      // goals
      if (config.isSetting('c', 'clean')) {
        // add clean goal to the build parameters
        params.push('clean');
      }
      // add package goal
      params.push('test');
      // profiles
      var profiles = config.getSettingByNames('p', 'profile', null);
      if (profiles) {
        // add profile(s)
        params.push('-P', profiles);
      }
      if (config.isVerbose()) {
        logger.info('Maven (%s %s)', mavenSetting.maven, params.join(' '));
      }

      return runner.execute(mavenSetting.maven, params);
    });
}

function deployApplication_(asAdminSetting, appName, filename) {
  logger.info('try to deploy "%s" (%s) on domain "%s" ...',
    appName, builder.shortPathName(filename), asAdminSetting.domainName
  );
  return ioThen.exists(filename)
    .then(function (fileExist) {
      if (!fileExist) {
        return Q.reject(builder.createError(null, 'File "%s" is not exist! Could not deploy "%s"!',
          builder.shortPathName(filename), appName
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

      if (config.isVerbose()) {
        logger.info('AsAdmin (%s %s)', asAdminSetting.asadmin, params.join(' '));
      }

      return runner.execute(asAdminSetting.asadmin, params)
        .then(function (executeMessage) {
          // extends with the appName and filename!
          executeMessage.appName = appName;
          executeMessage.filename = builder.shortPathName(filename);

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

/**
 * @param {ActionInfo} info
 * @return {Q.promise}
 * @private
 */
function startServer_(info) {
  return Q.fcall(function () {
    logger.info('Execute "%s" (%s)', info.action, info.description);
    return asadmin.getAsAdminSettingValues()
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
          var env = runner.getEnvironment();
          if (config.isVerbose()) {
            logger.info('AsAdmin (%s %s)', asAdminSetting.asadmin, params.join(' '));
          }
          return runner.execute(asAdminSetting.asadmin, params, env);
        }
      );
  });
}

/**
 * @param {ActionInfo} info
 * @return {Q.promise}
 * @private
 */
function stopServer_(info) {
  return Q.fcall(function () {
    logger.info('Execute "%s" (%s)', info.action, info.description);
    return asadmin.getAsAdminSettingValues()
      .then(
        function (asAdminSetting) {
          logger.info('Stop domain "%s"...', asAdminSetting.domainName);
          // build parameters
          var params = [
            'stop-domain',
            '--domaindir', asAdminSetting.domainHome
          ];

          if (config.isSetting('k', 'kill')) {
            // add the kill flag
            params.push('--kill');
          }

          params.push(asAdminSetting.domainName);

          if (config.isVerbose()) {
            logger.info('AsAdmin (%s %s)', asAdminSetting.asadmin, params.join(' '));
          }

          return runner.execute(asAdminSetting.asadmin, params);
        }
      );
  });
}
