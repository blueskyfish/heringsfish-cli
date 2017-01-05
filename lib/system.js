/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/system
 * @description
 * Encapsulates internal important functions
 *
 * @requires path
 * @requires lodash
 */

const path  = require('path');

const _     = require('lodash');


// constants
const WIN32_HOME = 'USERPROFILE';
const UNIX_HOME  = 'HOME';

const APP_PATH   = path.normalize(path.join(__dirname, '..'));

/**
 * Returns the directory of this node module.
 */
module.exports.getAppHomePath = function () {
  return APP_PATH;
};

/**
 * get the environment value from the given name.
 *
 * @param {string} name the environment variable name
 * @return {string|*|null} the value of the environment variable
 */
module.exports.getEnvFrom = function (name) {
  if (_.isString(name)) {
    const loName = name.toLowerCase();
    const upName = name.toUpperCase();
    return process.env[upName] || process.env[loName] || null;
  }
  return null;
};

/**
 * Returns the user home directory.
 *
 * @return {string}
 */
module.exports.getHomePath = function () {
  var name = (process.platform === 'win32') ? WIN32_HOME : UNIX_HOME;
  return module.exports.getEnvFrom(name);
};

/**
 * returns the project home path.
 *
 * @return {string}
 */
module.exports.getProjectHomePath = function () {
  return process.cwd();
};
