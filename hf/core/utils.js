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

const path    = require('path');

const _ = require('lodash');

const DEFINES = require('hf/defines');

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
 * Returns the home path of the command.
 *
 * ```js
 * const cmdPath = '/opt/apache/maven/latest/bin/mvn';
 * const homePath = helper.adjustCommandHomePath(cmdPath);
 * console.log(homePath); // '/opt/apache/maven/latest'
 * ```
 *
 * @param {String} cmdPath the complete path to the command with include command
 * @return {String}
 */
module.exports.adjustCommandHomePath = function (cmdPath) {
  return path.dirname(path.dirname(cmdPath));
};
