/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const Q = require('q');

/**
* @type {ActionInfo}
*/
const mInfo = {
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
