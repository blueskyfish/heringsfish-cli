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
 * Remove and delete the domain on the application server.
 */

const asadmin = require('hf/core/asadmin');

/**
 * Remove and delete the domain on the application server.
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  return asadmin.removeDomain(options);
};
