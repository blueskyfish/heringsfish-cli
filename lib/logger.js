/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/logger
 * @description
 * Write the log messages to the console.
 *
 * @requires util
 * @requires colors
 * @requires moment
 * @requires module:hf/config
 */

const util = require('util');

const colors   = require('colors');
const moment   = require('moment');

const config = require('lib/config');

colors.setTheme({
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  error: 'red'
});

/**
 * Writes the debug message to the console output. Only if the parameter `v` or `verbose` is given.
 */
module.exports.debug = function () {
  if (config.isVerbose()) {
    var message = _toString(arguments);
    console.log(_toOutput('debug', message));
  }
};

/**
 * Writes the info message to the console output. Only if the parameter `q` or `quite` is not given.
 */
module.exports.info = function () {
  if (!config.isQuiet()) {
    var message = _toString(arguments);
    console.log(_toOutput('info', message));
  }
};

/**
 * Writes the warning message to the console output.
 */
module.exports.warn = function () {
  var message = _toString(arguments);
  console.log(_toOutput('warn', message));
};

/**
 * Writes the error message to the console output.
 */
module.exports.error = function () {
  var message = _toString(arguments);
  console.log(_toOutput('error', message));
};

//
// internal functions
//

function _toOutput(level, message) {
  var time = moment().format('HH:MM:ss.SSS');
  switch (level) {
    case 'info':
      return util.format('%s %s', colors.info('[' + time + ']'), message);
    case 'warn':
      return util.format('%s %s', colors.warn('[' + time + ']'), message);
    case 'error':
      return util.format('%s %s', colors.error('[' + time + ']'), message);
    default:
      return util.format('%s %s', colors.debug('[' + time + ']'), message);
  }
}

function _toString(args) {
  if (args.length == 0) {
    return '';
  } else if (args.length === 1) {
    return args[0];
  } else {
    var params = Array.prototype.slice.call(args);
    return util.format.apply(util, params);
  }
}
