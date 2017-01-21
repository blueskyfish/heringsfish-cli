/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/kernel/startup
 * @description
 * Load settings and parse the arguments of the application.
 *
 * @requires fs
 * @requires path
 * @requires lodash
 * @requires minimist
 * @requires module:hf/defines
 * @requires module:hf/core/io
 */

const fs       = require('fs');
const path     = require('path');

const _        = require('lodash');
const minimist = require('minimist');

const DEFINES  = require('hf/defines');
const io       = require('hf/core/io');

/**
 * @name Parameters
 * @description Contains the arguments of the node module
 * @property {string}        action
 * @property {boolean}       verbose
 * @property {boolean}       quiet
 * @property {object}        options
 * @property {Array<string>} list
 */

/**
 *
 * @param {Array<String>} args
 * @return {Parameters}
 */
module.exports.parseArguments = function (args) {
  const temp = minimist(args);

  /** @type {Parameters} */
  let params = {
    verbose: false,
    quiet: false,
    action: 'help',
    options: {},
    list: []
  };

  if (temp.v || temp.verbose) {
    params.verbose = true;
  }
  if (temp.q || temp.quiet) {
    params.quiet = true;
  }
  if (temp.a || temp.action || temp._[0]) {
    params.action = temp.a || temp.action || temp._[0];
  }
  params.options = {};
  _.forEach(temp, function (value, name) {
    switch (name) {
      case 'a':
      case 'action':
      case 'v':
      case 'verbose':
      case 'q':
      case 'quiet':
        break;
      case '_':
        _.forEach(value, function (name) {
          params.options[name] = true;
        });
        params.list = value;
        break;
      default:
        params.options[name] = value;
        break;
    }
  });
  // adjust the parameters
  if (params.options[params.action]) {
    delete params.options[params.action];
  }
  let index = params.list.indexOf(params.action);
  if (index >= 0) {
    params.list.splice(index, 1);
  }
  // when the action is "help" don't set quiet to true.
  if (params.action === 'help') {
    params.quiet = false;
  }

  if (params.quiet) {
    // when quite, shut up verbose
    params.verbose = false;
  }

  return params;
};

/**
 * Reads the server configuration and the user environments. Also it reads the main plugin registry.
 *
 * @param {String} appHomePath
 * @param {String} projectHomePath
 * @param {String} userHomePath
 * @return {Promise<Object>}
 */
module.exports.readConfiguration = function (appHomePath, projectHomePath, userHomePath) {

  const filename = path.join(projectHomePath, DEFINES.SERVER_CONFIG_FILENAME);

  return io.readJson(filename)
    .then(function (configs) {

      configs = configs || {};

      const projectName = _.get(configs, 'project.name', null);
      if (!projectName) {

        const userFilename = path.join(userHomePath, _prepareProjectName(projectName, projectHomePath));

        return io.readJson(userFilename)
          .then(function (userConfigs) {

            // merge environments
            _.set(configs, 'env',
              _.merge(
                {},
                _.get(configs, 'env', {}),
                _.get(userConfigs, 'env', {})
              )
            );

            return configs;
          });
      }
      return configs;
    })
    .then(function (configs) {

      // load the main plugins
      const pluginFilename = path.join(appHomePath, 'plugins.json');

      return io.readJson(pluginFilename)
        .then (function (mainPlugins) {

          // get the user plugins
          const userPlugins = _.get(configs, 'plugins', {});

          const pluginRegistry = _.merge({}, mainPlugins, userPlugins);
          _.set(configs, 'plugins', pluginRegistry);
          return configs;
        });
    })
    .then(function (configs) {

      // set the loading time
      configs.loadTime = Date.now();

      return configs;
    });
};

module.exports.readAppPackage = function (appHomePath) {
  const filename = path.join(appHomePath, 'package.json');
  return require(filename);
};


//
// Internal Functions
//

function _prepareProjectName(projectName, projectHomePath) {
  if (!_.isString(projectName)) {
    projectName = path.basename(projectHomePath);
  }
  return projectName.replace(/ /g, '-').toLowerCase() + '.json';
}
