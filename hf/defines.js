/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/defines
 * @description
 * Some useful constant definitions
 */


let _PROJECT_PATH = '';
let _APP_PATH = null;

const _FILE_ENCODING = 'utf8';
const _IS_WIN = process.platform === 'win32';
const _SERVER_CONFIG_FILENAME = 'server-config.json';

// constants
const WIN32_HOME = 'USERPROFILE';
const UNIX_HOME  = 'HOME';

let DEFINES = {};

Object.defineProperty(DEFINES, 'PROJECT_PATH', {
  enumerable: true,
  get: function () {
    return _PROJECT_PATH;
  },
  set: function (path) {
    if (_PROJECT_PATH === '') {
      _PROJECT_PATH = path;
    }
  },
  configurable: true
});

Object.defineProperty(DEFINES, 'APPLICATION_PATH', {
  enumerable: true,
  get: function () {
    return _APP_PATH;
  },
  set: function (path) {
    if (!_APP_PATH) {
      _APP_PATH = path;
    }
  },
  configurable: true
});

Object.defineProperty(DEFINES, 'FILE_ENCODING', {
  enumerable: true,
  get: function () {
    return _FILE_ENCODING;
  }
});

Object.defineProperty(DEFINES, 'IS_WIN', {
  enumerable: true,
  get: function () {
    return _IS_WIN;
  }
});

Object.defineProperty(DEFINES, 'USER_HOME_PATH', {
  configurable: true,
  enumerable: true,
  get: function () {
    const name = _IS_WIN ? WIN32_HOME : UNIX_HOME;
    return process.env[name];
  }
});

Object.defineProperty(DEFINES, 'SERVER_CONFIG_FILENAME', {
  configurable: true,
  enumerable: true,
  get: function () {
    return _SERVER_CONFIG_FILENAME;
  }
});

/**
 * Do it and override the existing thing
 */
Object.defineProperty(DEFINES, 'DO_OVERRIDE', {
  configurable: true,
  enumerable: true,
  value: 1
});

/**
 * Do it and create the thing
 */
Object.defineProperty(DEFINES, 'DO_CREATION', {
  configurable: true,
  enumerable: true,
  value: 2
});

Object.defineProperty(DEFINES, 'DO_CANCEL', {
  configurable: true,
  enumerable: true,
  value: 0
});

module.exports = DEFINES;
