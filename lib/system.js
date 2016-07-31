/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var _ = require('lodash');


/**
 * @class System
 * @description
 * The system module has all
 *
 */
var systemModule = module.exports = {};

/**
 * getEnvFrom - get the environment value from the given name.
 *
 * @param {string} name the environment variable name
 * @return {string|*|null} the value of the environment variable
 */
systemModule.getEnvFrom = function (name) {
  if (_.isString(name)) {
    var loName = name.toLowerCase();
    var upName = name.toUpperCase();
    return process.env[upName] || process.env[loName] || null;
  }
  return null;
};

/**
 * getHomePath - Returns the user home directory.
 *
 * @return {string}
 */
systemModule.getHomePath = function () {
  var name = (process.platform === 'win32') ? 'USERPROFILE' : 'HOME';
  return systemModule.getEnvFrom(name);
};

/**
 * getProjectHomePath - returns the project home path.
 *
 * @return {string}
 */
systemModule.getProjectHomePath = function () {
  return process.cwd();
};
