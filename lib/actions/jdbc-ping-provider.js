/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 *
 * Purpose:
 * Ping a JDBC Connection Pool
 */

'use strict';

var logger = require('../logger');
var runner = require('../runner');

var jdbcUtils = require('./jdbc-utils');

module.exports = {

  run: function (jdbcName) {
    return run_(jdbcName);
  }
};

function run_(jdbcName) {
  return jdbcUtils.validateJdbcName(jdbcName)
    .then(function (jdbcSettings) {
      return runner.getAsAdminSettingValues(true)
        .then(function (asAdminSettings) {

          var poolName = jdbcUtils.buildConnectPoolName(jdbcName);
          var params = [
            '--port', asAdminSettings.adminPort,
            'ping-connection-pool',
            poolName
          ];

          logger.info('Ping JDBC Connection Pool "%s" from "%s"',
            poolName, asAdminSettings.domainName);

          return runner.execute(asAdminSettings.asadmin, params);
        });
     });
}
