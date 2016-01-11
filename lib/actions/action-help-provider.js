/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var path = require('path');
var util = require('util');

var _ = require('lodash');
var Q = require('q');

var logger = require('../logger');
var settings = require('../settings');
var utilities = require('../utilities');

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'help',
  description: 'Show the help'
};

/**
 * @type {ActionProvider}
 */
module.exports = {

  run: function () {
    return run_();
  },

  info: function () {
    return mInfo;
  }
};

function run_() {
  return Q.fcall(function () {
    var startTime = Date.now();
    var helpAction = _prepareHelpAction(settings.getSetting(0, null));
    var helpFilename = path.join(utilities.getExecuteHome(), 'templates', util.format('man.%s.txt', helpAction));
    logger.debug('lookup to file "%s"', utilities.shortPathName(helpFilename));
    return utilities.readFile(helpFilename).then(
      function (content) {
        var lines = _.isString(content) ? content.split('\n') : [];
        _.forEach(lines, function (line) {
          logger.info(line);
        });
        var bean = { duration: (Date.now() - startTime) };
        return utilities.success(bean, 'Finish with display the "%s" help topic.', helpAction);
      },
      function (reason) {
        logger.error('Could not found the "%s" help topic!', helpAction);
        return reason;
      }
    );
  });
}


function _printHelpAction(action) {
  logger.info('Help for command "%s" ...', action);
  logger.info();
}

function _printUsage() {
  logger.info('Usage:');
  logger.info('  $ hf action [options]');
  logger.info();
  logger.info('Actions:');
  logger.info('  help [action]           show this help');
  logger.info('  config options [value]  write and read the configuration. If the "value"');
  logger.info('                          is present, then it write into the configuration');
  logger.info('');
}

function _prepareHelpAction(helpAction) {
  if (_.isString(helpAction)) {
    return helpAction.replace(/ /g, '-').toLowerCase();
  }
  return 'help';
}