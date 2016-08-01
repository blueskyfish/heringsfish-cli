/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 *
 */

'use strict';

var util = require('util');

var Q = require('q');

var configure = require('../configure');


module.exports.validateJdbcName = function (jdbcName) {

  if (!jdbcName) {
    // need a jdbc name
    return Q.reject({
      exitCode: 1,
      message: 'Missing the JDBC name'
    });
  }

  var jdbcSettings = configure.get(util.format('domain.jdbc.%s', jdbcName), null);
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