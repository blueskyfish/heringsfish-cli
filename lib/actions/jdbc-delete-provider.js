/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 *
 * Purpose:
 * Delete a JDBC Connection Pool and a JDBC Resource
 */

'use strict';

var util = require('util');

var logger = require('../logger');
var runner = require('../runner');

var jdbcUtils = require('./jdbc-utils');


module.exports = {

  /**
   * run - Delete a JDBC Connection Pool and a JDBC Resource
   *
   * @param {string} jdbcName
   * @return {promise}
   */
  run: function (jdbcName) {
    return run_(jdbcName);
  }
};

function run_(jdbcName) {

  return jdbcUtils.validateJdbcName(jdbcName)
    .then(function (jdbcSettings) {

      var poolName = jdbcUtils.buildConnectPoolName(jdbcName);
      var resName = jdbcUtils.buildResourceName(jdbcName);

      return runner.getAsAdminSettingValues(true)
        .then(function (asAdminSettings) {

          var resParams = [
            '--port', asAdminSettings.adminPort,
            'delete-jdbc-resource',
            resName
          ];

          logger.info('Delete JDBC Resource "%s" from "%s"', resName, asAdminSettings.domainName);
          return runner.execute(asAdminSettings.asadmin, resParams)
            .then(function (resResult) {

              var poolParams = [
                '--port', asAdminSettings.adminPort,
                'delete-jdbc-connection-pool',
                '--cascade=true',
                poolName
              ];

              logger.info('Delete JDBC Connection Pool "%s" from "%s"', poolName,
                asAdminSettings.domainName);
              return runner.execute(asAdminSettings.asadmin, poolParams)
                .then(function (poolResult) {
                  return {
                    exitCode: 0,
                    duration: resResult.duration + poolResult.duration,
                    message: util.format('Delete JDBC Connection Pool "%s" and JDBC Resource "%s"',
                      poolName, resName)
                  };
                });
            });
        });
    });
}

