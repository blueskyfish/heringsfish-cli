/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const logger = require('lib/logger');
const composed = require('lib/actions/composed');

/**
 * @type {ActionInfo}
 */
const mInfo = {
  action: 'test',
  description: 'Executes the maven test goal'
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
