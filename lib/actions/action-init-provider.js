/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');

var _ = require('lodash');
var Q = require('q');

var configure = require('../configure');
var logger = require('../logger');
var runner = require('../runner');
var settings = require('../settings');
var utilities = require('../utilities');

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'init',
  description: 'Initialized the configuration'
};

var TEMPLATE_FILENAME = path.join(utilities.getExecuteHome(), 'templates', 'server-config.json');

/**
 * @type {ActionProvider}
 */
module.exports = {

  run: function () {
    return run_();
  },

  info: function () {
    return mInfo;
  },

  help: function () {
    return help_();
  }
};

function run_() {
  logger.info('Execute "%s" (%s)', mInfo.action, mInfo.description);

  var startTime = Date.now();
  var configFilename = configure.getFilename();

  return utilities.exists(configFilename)
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
  var info = path.parse(process.cwd());
  var name = info.name || 'hf-project';
  return name.replace(/ /g, '-').toLowerCase();
}

function _calculateHomePath(filename) {
  return path.dirname(path.dirname(filename));
}

/**
 * @return {Q.promise} the resolve parameter is the JSON object.
 * @private
 */
function _decideOverrideAndReadTemplate(fileExists) {
  if (fileExists && !settings.isSetting('f', 'force')) {
    var reason = utilities.error(null,
      'Cancel: configuration file is already existing! ' +
      'Call with -f or --force to override existing configuration file.');
    return Q.reject(reason);
  }
  // read the template config file
  return utilities.readJson(TEMPLATE_FILENAME);
}

/**
 * @return {Q.promise} the resolve parameter is the config JSON object.
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
 * @return {Q.promise} the resolve parameter is the SuccessMessage
 * @private
 */
function _saveConfigSettings(configBean, startTime) {
  // set the default project name
  var projectName = _calculateProjectName();
  _.set(configBean, 'name', projectName);
  _.set(configBean, 'domain.name', projectName);
  _.set(configBean, 'command.asadmin', '{server.home}/bin/asadmin');

  configure.replace(configBean);

  if (settings.isSetting('l', 'list')) {
    configure.print();
  }

  var bean = {
    duration: (Date.now() - startTime)
  };
  return Q.resolve(utilities.success(bean, ' initial project "%s"', projectName));
}
