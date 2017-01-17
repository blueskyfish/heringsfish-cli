/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const path = require('path');
const util = require('util');

const _ = require('lodash');
const Q = require('q');

const config    = require('lib/config');
const defines   = require('lib/defines');
const logger    = require('lib/logger');
const builder   = require('lib/core/builder');
const ioThen    = require('lib/core/io-then');


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
    var helpAction = _prepareHelpAction(config.getSetting(0, null));
    var helpFilename = path.join(defines.HF_APP_HOME, 'templates', util.format('man.%s.txt', helpAction));
    logger.debug('lookup to file "%s"', builder.shortPathName(helpFilename));
    return ioThen.readFile(helpFilename).then(
      function (content) {
        var lines = _.isString(content) ? content.split('\n') : [];
        if (_.size(lines) > 0) {
          logger.info('-------------------------------------------------------------------------------')
        }
        _.forEach(lines, function (line) {
          logger.info(line);
        });
        if (_.size(lines) > 0) {
          logger.info('-------------------------------------------------------------------------------')
        }
        logger.info();
        var bean = { duration: (Date.now() - startTime) };
        return builder.createSuccess(bean, 'Finish with display the "%s" help topic.', helpAction);
      },
      function (reason) {
        logger.error('Could not found the "%s" help topic!', helpAction);
        return reason;
      }
    );
  });
}

function _prepareHelpAction(helpAction) {
  if (_.isString(helpAction)) {
    return helpAction.replace(/ /g, '-').toLowerCase();
  }
  return 'help';
}
