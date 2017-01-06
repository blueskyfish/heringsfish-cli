/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 *
 * Purpose:
 * TODO Initialize and run the setup
 */

'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const _ = require('lodash');
const Q = require('q');

const config    = require('lib/config');
const defines   = require('lib/defines');
const logger    = require('lib/logger');
const runner    = require('lib/runner');

const builder   = require('lib/core/builder');
const ioThen    = require('lib/core/io-then');

/**
 * @type {ActionInfo}
 */
const mInfo = {
  action: 'init',
  description: 'Initialized the configuration'
};

const TEMPLATE_FILENAME = path.join(defines.HF_APP_HOME, 'templates', 'server-config.json');

/**
 * @type {ActionProvider}
 */
module.exports = {

  run: function () {
    return Q.resolve('Deprecated: the action "init" is not implemented!');
    // return run_();
  },

  info: function () {
    return mInfo;
  }
};

function run_() {
  logger.info('Execute "%s" (%s)', mInfo.action, mInfo.description);

  const startTime = Date.now();
  var configFilename = ''; // configure.getFilename();

  return ioThen.exists(configFilename)
    .then(function (fileExists) {
      return _decideOverrideAndReadTemplate(fileExists);
    })
    .then(function (configBean) {
      return _findMavenAndAsAdmin(configBean);
    })
    .then(function (configBean) {
      return _saveConfigSettings(configBean, startTime)
    });
}

function _calculateProjectName() {
  const name = builder.getProjectPathName();
  return name.replace(/ /g, '-').toLowerCase();
}

function _calculateHomePath(filename) {
  return path.dirname(path.dirname(filename));
}

/**
 * @return {promise} the resolve parameter is the JSON object.
 * @private
 */
function _decideOverrideAndReadTemplate(fileExists) {
  if (fileExists && !config.isSetting('f', 'force')) {
    var reason = builder.createError(null,
      'Cancel: configuration file is already existing! ' +
      'Call with -f or --force to override existing configuration file.');
    return Q.reject(reason);
  }
  // read the template config file
  return ioThen.readJson(TEMPLATE_FILENAME);
}

/**
 * @return {promise} the resolve parameter is the config JSON object.
 * @private
 */
function _findMavenAndAsAdmin(configBean) {
  // search for the programs
  var mavenFinder = runner.findCommand('mvn');
  var asadminFinder = runner.findCommand('asadmin');

  return Q.all([mavenFinder, asadminFinder]).then(
    function (files) {
      _.forEach(files, function (result) {
        if (result.mvn) {
          _.set(configBean, 'maven.home', _calculateHomePath(result.mvn));
        } else if (result.asadmin) {
          _.set(configBean, 'server.home', _calculateHomePath(result.asadmin));
        }
      });
      return configBean;
    },
    function (reason) {
      logger.error(reason);
      return Q.resolve(configBean);
    }
  );
}

/**
 * @return {promise} the resolve parameter is the SuccessMessage
 * @private
 */
function _saveConfigSettings(configBean, startTime) {
  // set the default project name
  var projectName = _calculateProjectName();
  _.set(configBean, 'name', projectName);
  _.set(configBean, 'domain.name', projectName);
  if (defines.IS_WIN) {
    _.set(configBean, 'command.asadmin.win32', '{server.home}/bin/asadmin.bat');
  }
  else {
    _.set(configBean, 'command.asadmin.unix', '{server.home}/bin/asadmin');
  }

  // Deprecated: config.replace(configBean);

  if (config.isSetting('l', 'list')) {
    // Deprecated: config.print() use instead config.printConfig();
  }

  var bean = {
    duration: (Date.now() - startTime)
  };
  return Q.resolve(builder.createSuccess(bean, ' initial project "%s"', projectName));
}
