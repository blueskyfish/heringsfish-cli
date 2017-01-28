/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/stop-database
 * @description
 * Stops the builtin database "derby"
 *
 * @requires module:hf/core/asadmin
 */

const asadmin = require('hf/core/asadmin');

/**
 * Stops the application server with the domain
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  return asadmin.stopDatabase(options);
};
