/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/deploy-maven
 * @description
 * Builds the project with Maven and deploy the application(s) on the server.
 *
 * @requires util
 * @requires lodash
 * @requires module:hf/core/builder
 * @requires module:hf/core/maven
 * @requires module:hf/core/asadmin
 */

const util    = require('util');

const _       = require('lodash');

const maven   = require('hf/core/maven');
const asadmin = require('hf/core/asadmin');
const utils   = require('hf/core/utils');


/**
 * Builds the project with Maven and deploy the application(s) on the server.
 *
 * **Errors**
 *
 * | Code     | Description
 * |----------|-----------------
 * | 0xffaa10 | Missing the java archive for "xx"
 * | 0xffaa11 | There are no applications for deployment!
 * | 0xfff122 | Could not deploy on "xx". Archive "yy" is not exist
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  const that = this;
  return asadmin.getAsAdminSetting(options, true)
    .then((asAdminSetting) => {

      let buildPromise = null;
      if (!options.getParam('nobuild', false)) {
        buildPromise = maven.buildProject(options);
      }

      if (!buildPromise) {
        return Promise.all([buildPromise])
          .then((runResult) => {

            options.logDebug("build project: %s - %s ms", runResult.message || '...', runResult.duration || '??');

            if (runResult.exitCode && runResult.exitCode > 0) {
              return Promise.reject(runResult);
            }

            // deploy the application(s)
            return _executeDeployment(options, asAdminSetting);
          });
      }
      return _executeDeployment(options, asAdminSetting);
    });
};


//
// Internal Functions
//

/**
 *
 *
 * @param {Options} options
 * @param {AsAdminSetting} asAdminSetting the asadmin setting with the port(s).
 * @return {Promise<RunResult>}
 * @private
 */
function _executeDeployment(options, asAdminSetting) {
  let appName = options.getParam(0, null);
  if (appName) {

    const appNameProperty = utils.adjustPropertyName(appName);
    options.logInfo('Deploy one application "%s"', appNameProperty);

    const filename = options.getConfig('domain.deploy.' + appNameProperty, null);
    if (!filename) {
      return Promise.reject({
        code: 0xffaa10,
        message: util.format('Missing the java archive for "%s"', appNameProperty)
      });
    }
    return asadmin.deployApplication(options, asAdminSetting, appNameProperty, options.parseValue(filename));
  }

  const appList = options.getConfig('domain.deploy', {});
  if (_.size(appList) === 0) {
    return Promise.reject({
      code: 0xffaa11,
      message: 'There are no applications for deployment!'
    });
  }

  options.logDebug('Deploy all application');

  const appPromiseList = [];

  _.forEach(appList, (filename, appName) => {

    const appNameProperty = utils.adjustPropertyName(appName);
    const adjustFilename = options.parseValue(filename);

    options.logInfo('Deploy application "%s"', appNameProperty);

    appPromiseList.push(asadmin.deployApplication(options, asAdminSetting, appNameProperty, adjustFilename));
  });

  return Promise.all(appPromiseList)
    .then((resultList) => {

      const result = {
        exitCode: 0,
        appNames: [],
        filenames: []
      };

      _.forEach(resultList, (executeMessage) => {
        options.logDebug('Deploy "%s" successful', executeMessage.appName);
        result.appNames.push(executeMessage.appName);
        result.filenames.push(executeMessage.filename);
      });

      return result;
    });
}
