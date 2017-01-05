/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

var Q = require('q');

var composed = require('./composed');

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'start',
  description: 'Starts the Glassfish / Payara domain'
};

/**
 * @type {ActionProvider}
 */
module.exports = {
  run: function () {
    return composed.startServer(mInfo);
  },

  info: function () {
    return mInfo;
  }
};
