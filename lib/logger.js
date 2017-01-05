/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

var util = require('util');

var colors = require('colors');
var dateformat = require('dateformat');

var settings = require('./settings');

colors.setTheme({
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  error: 'red'
});

module.exports = {

  debug: function () {
    if (settings.isVerbose()) {
      var message = _toString(arguments);
      console.log(_toOutput('debug', message));
    }
  },

  info: function () {
    if (!settings.isQuiet()) {
      var message = _toString(arguments);
      console.log(_toOutput('info', message));
    }
  },

  warn: function () {
    var message = _toString(arguments);
    console.log(_toOutput('warn', message));
  },

  error: function () {
    var message = _toString(arguments);
    console.log(_toOutput('error', message));
  }
};


function _toOutput(level, message) {
  var time = dateformat('HH:MM:ss');
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
