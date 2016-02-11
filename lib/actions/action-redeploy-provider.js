/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var Q = require('q');

/**
* @type {ActionInfo}
*/
var mInfo = {
  action: 'restart',
  description: 'Undeploy the maven artifacts and then deploy its again'
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
  return Q.reject({
    message: 'Not implemented yet'
  });
}