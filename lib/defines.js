/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const path   = require('path');


/**
 * The home directory of this node module.
 *
 * @type {string}
 * @private
 */
const _HF_APP_HOME = path.normalize(path.join(__dirname, '..'));
const _PROJECT_HOME = process.cwd();

// constants
const WIN32_HOME = 'USERPROFILE';
const UNIX_HOME  = 'HOME';

var defines = {};

Object.defineProperty(defines, 'HF_APP_HOME', {
  configurable: true,
  enumerable: true,
  get: function () {
    return _HF_APP_HOME;
  }
});

Object.defineProperty(defines, 'PROJECT_HOME', {
  configurable: true,
  enumerable: true,
  get: function () {
    return _PROJECT_HOME;
  }
});

Object.defineProperty(defines, 'FILE_ENCODING', {
  configurable: true,
  enumerable: true,
  value: 'utf8'
});

Object.defineProperty(defines, 'USER_HOME_PATH', {
  configurable: true,
  enumerable: true,
  get: function () {
    var name = (process.platform === 'win32') ? WIN32_HOME : UNIX_HOME;
    return process.env[name];
  }
});

module.exports = defines;
