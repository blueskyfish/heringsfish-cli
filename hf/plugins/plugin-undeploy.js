/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/undeploy
 * @description
 * Undeploy and remove application(s) from the application server.
 */

/**
 * Undeploy and remove application(s) from the application server.
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  return Promise.reject({
    message: 'Undeploy: not implemented yet!'
  });
};
