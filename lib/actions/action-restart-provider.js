/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var composed = require('./composed');

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'restart',
  description: 'Stops and Starts the Glassfish / Payara domain'
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
  return composed.stopServer(mInfo).then(function (stopResult) {
    return composed.startServer(mInfo).then(function (startResult) {
      var startExitCode = startResult.exitCode || 0;
      var stopExitCode = stopResult.exitCode || 0;
      return {
        duration: stopResult.duration + startResult.duration,
        exitCode: stopExitCode === 0 && startExitCode === 0 ? 0 : Math.max(stopExitCode, startExitCode)
      };
    })
  })
}