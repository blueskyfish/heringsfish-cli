/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/restart-server
 * @description
 * Stops and restarts the application server with the domain
 *
 * @requires module:hf/core/asadmin
 */

const asadmin = require('hf/core/asadmin');

/**
 * Stops and restarts the application server with the domain
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  return asadmin.stopServer(options)
    .then((runResult) => {
      return asadmin.startServer(options);
    });
};
