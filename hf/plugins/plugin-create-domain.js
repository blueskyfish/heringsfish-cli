/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/create
 * @description
 * Creates the domain for the Payara / Glassfish application server.
 * If the domain is already exist then it cancels of creation of the domain.
 *
 * @requires module:hf/core/asadmin
 */

const asadmin = require('hf/core/asadmin');

/**
 * Create the domain for the server.
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  return asadmin.createDomain(options);
};
