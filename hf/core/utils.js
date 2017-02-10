/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/utils
 * @description
 * Small util library
 *
 * @requires path
 * @requires lodash
 * @requires module:hf/defines
 */

const path     = require('path');

const _        = require('lodash');
const minimist = require('minimist');

const DEFINES  = require('hf/defines');

/**
 * Returns true if the value is a string and doesn't contain '' or '-'.
 *
 * @param {*} s
 * @return {boolean}
 */
module.exports.hasStringValue = function (s) {
  return (_.isString(s) && s !== '' && s !== '-')
};

/**
 * Returns the default project name. It calculate from the parent directory.
 *
 * @return {String} the project name without whitespaces and lowercase
 */
module.exports.getDefaultProjectName = function () {
  return path.basename(DEFINES.PROJECT_PATH).replace(/ /g, '-').toLowerCase();
};

/**
 * Remove the whitespaces and convert into lower case.
 * @param {String} name
 * @return {String}
 */
module.exports.adjustPropertyName = function (name) {
  if (!_.isString(name)) {
    return name;
  }
  return name.replace(/[^a-zA-Z]/g, '-').replace(/--/, '-').toLowerCase();
};

/**
 * Returns the home path of the command.
 *
 * **Assumption**
 *
 * * The application is assumed to be in a bin directory.
 * * This removes the file name and the bin directory to get the home directory
 *
 * ```js
 * const cmdPath = '/opt/apache/maven/latest/bin/mvn';
 * const homePath = helper.adjustCommandHomePath(cmdPath);
 * console.log(homePath); // '/opt/apache/maven/latest' (remove "bin/mvn")
 * ```
 *
 * @param {String} cmdPath the complete path to the command with include command
 * @return {String}
 */
module.exports.adjustCommandHomePath = function (cmdPath) {
  return path.dirname(path.dirname(cmdPath));
};

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
