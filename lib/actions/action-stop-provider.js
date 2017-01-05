/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const composed = require('lib/actions/composed');

/**
 * @type {ActionInfo}
 */
const mInfo = {
  action: 'stop',
  description: 'Stops the Glassfish / Payara domain'
};

/**
 * @type {ActionProvider}
 */
module.exports = {
  run: function () {
    return composed.stopServer(mInfo);
  },

  info: function () {
    return mInfo;
  }
};
