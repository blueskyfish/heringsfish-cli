/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 *
 */

'use strict';

const util = require('util');

const Q    = require('q');

const config = require('lib/config');

/**
 * Try to validate the jdbc name and if it is valid then it returns in the promise resolve callback.
 * @param {String} jdbcName the jdbc name
 * @return {promise}
 */
module.exports.validateJdbcName = function (jdbcName) {

  if (!jdbcName) {
    // need a jdbc name
    return Q.reject({
      exitCode: 1,
      message: 'Missing the JDBC name'
    });
  }

  var jdbcSettings = config.getConfig(util.format('domain.jdbc.%s', jdbcName), null);
  if (!jdbcSettings) {
    return Q.reject({
      exitCode: 1,
      message: util.format('Missing JDBC settings for "%s"', jdbcName)
    });
  }
  return Q.resolve(jdbcSettings);
};

module.exports.buildConnectPoolName = function (jdbcName) {
  return util.format('%sPool', jdbcName);
};

module.exports.buildResourceName = function (jdbcName) {
  return util.format('jdbc/%s', jdbcName);
};
