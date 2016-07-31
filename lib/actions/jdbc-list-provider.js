/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 *
 * Purpose:
 * List all jdbc pools and resources from the Glassfish / Payara
 */

'use strict';

var runner = require('../runner');
var logger = require('../logger');

module.exports = {

  run: function () {
    return run_();
  }
};

function run_() {
  // list all
  return runner.getAsAdminSettingValues(true)
    .then(function (asAdminSetting) {
      var params = [
        '--port', asAdminSetting.adminPort,
        'list-jdbc-connection-pools'
      ];

      logger.info('List all JDBC Connection Pools "%s":', asAdminSetting.domainName);

      return runner.execute(asAdminSetting.asadmin, params)
        .then(function (poolResult) {

          var params = [
            '--port', asAdminSetting.adminPort,
            'list-jdbc-resources'
          ];

          logger.info('List all JDBC Resources "%s":', asAdminSetting.domainName);

          return runner.execute(asAdminSetting.asadmin, params)
            .then(function (resResult) {
              return {
                duration: poolResult.duration + resResult.duration,
                exitCode: 0
              };
            });
        });
    });
}
