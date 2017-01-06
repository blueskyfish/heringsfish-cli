/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 *
 * Purpose:
 * Create a JDBC Connection Pool and a JDBC Resource
 */

'use strict';

const util = require('util');

const _    = require('lodash');

const config   = require('lib/config');
const logger   = require('lib/logger');
const runner   = require('lib/runner');
const jdbcUtils = require('lib/actions/jdbc-utils');
const asadmin  = require('lib/server/asadmin');

/**
 * @type {ActionProvider}
 */
module.exports = {

  /**
   * run - creates a JDBC connection pool and the JDBC resource
   *
   * @param {string} jdbcName the jdbc name
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

      return asadmin.getAsAdminSettingValues(true)
        .then(function (asAdminSettings) {

          var poolParams = _getConnectPoolParameters(poolName, asAdminSettings, jdbcSettings);

          logger.info('Create JDBC Connection Pool "%s" for "%s"', poolName, asAdminSettings.domainName);
          return runner.execute(asAdminSettings.asadmin, poolParams)
            .then(function (poolResult) {

              var resParams = _getResourceParameters(poolName, resName, asAdminSettings, jdbcSettings);

              logger.info('Create JDBC Resource "%s" for "%s"', resName, asAdminSettings.domainName);
              return runner.execute(asAdminSettings.asadmin, resParams)
                .then(function (resResult) {
                  return {
                    duration: poolResult.duration + resResult.duration,
                    exitCode: 0,
                    message: util.format('create JDBC connection pool "%s" and JDBC resource "%s"',
                      poolName, resName)
                  };
                });
            });
        });
    });
}

function _getConnectPoolParameters(poolName, asAdminSettings, jdbcSettings) {
  var poolParams = [
    '--port', asAdminSettings.adminPort,
    'create-jdbc-connection-pool'
  ];
  //
  _.forEach(jdbcSettings, function (value, name) {
    var param = _.toLower(name);
    if (param === 'properties') {
      poolParams.push('--property', _buildProperties(value));
    }
    else if (param === 'description') {
      poolParams.push('--description', util.format('%s (Pool)', value));
    }
    else {
      poolParams.push(util.format('--%s', name), value);
    }
  });
  // add the connect pool id
  poolParams.push(poolName);

  if (config.isVerbose()) {
    logger.debug('JDBC Connection Pool Parameters:');
    _.forEach(poolParams, function (param) {
      logger.debug(' > %s', param);
    });
  }
  return poolParams;
}


function _getResourceParameters(poolName, resName, asAdminSettings, jdbcSettings) {
  var resParams = [
    '--port', asAdminSettings.adminPort,
    'create-jdbc-resource',
    '--connectionpoolid', poolName
  ];

  if (jdbcSettings.description) {
    resParams.push('--description', util.format('%s (JDBC)', jdbcSettings.description));
  }

  resParams.push(resName);

  if (config.isVerbose()) {
    logger.debug('JDBC Resource Parameters:');
    _.forEach(resParams, function (param) {
      logger.debug(' > %s', param);
    });
  }
  return resParams;
}

function _buildProperties(properties) {
  if (_.size(properties) === 0) {
    return null;
  }

  var result = '';
  _.forEach(properties, function (text, name) {
    var value = text.replace(/;/g, '\\;').replace(/:/g, '\\:');
    result += util.format(':%s=%s', name, value);
  });
  return result.substr(1);
}
