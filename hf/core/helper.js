/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/helper
 * @description
 * Helper methods for the plugin
 */

const path    = require('path');

const DEFINES = require('hf/defines');

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
