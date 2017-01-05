/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

var logger = require('../logger');
var composed = require('./composed');

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'build',
  description: 'Build the application with maven'
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
  logger.info('Execute "%s" (%s)', mInfo.action, mInfo.description);
  return composed.buildProject();
}
