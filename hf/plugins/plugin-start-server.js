/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/start-server
 * @description
 * Starts the application server with the domain
 */

const asadmin = require('hf/core/asadmin');

/**
 * Starts the application server with the domain
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  return asadmin.startServer(options);
};
