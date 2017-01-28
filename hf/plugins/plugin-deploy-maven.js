/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/deploy-maven
 * @description
 * Builds and deploy the maven project(s) on the application server.
 *
 */


/**
 * Builds and deploy the maven project(s) on the application server.
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  return Promise.reject({
    message: 'Build-Maven: not implemented yet!'
  });
};
