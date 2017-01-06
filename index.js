#!/usr/bin/env node

/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

require('app-module-path').addPath(__dirname);
require('app-module-path').addPath(process.cwd());

const path = require('path');

const _    = require('lodash');

const actionLoader = require('lib/action-loader');
const config       = require('lib/config');
const defines      = require('lib/defines');
const logger       = require('lib/logger');
const json         = require('lib/core/json');

const pkg = require(path.join(defines.HF_APP_HOME, 'package.json'));

logger.info();
logger.info('%s (%s)', pkg.title, pkg.version);
logger.info();

// in verbose: show the parameters!
config.printParameters(function (content) {
  const text = content.split('\n');
  _.forEach(text, function (s) {
    logger.debug(s);
  });
});

logger.info('Project: %s', config.getConfig('name', '?'));
logger.info('Version: %s', config.getConfig('version', '0.0.0'));
logger.info('Home:    %s', defines.PROJECT_HOME);
logger.info('');
logger.info('User:    %s', defines.USER_HOME_PATH);
logger.info('HF Path: %s', defines.HF_APP_HOME);
logger.info('');

actionLoader.find(config.getAction())
  .then(function (actionProvider) {
    return actionProvider.run();
  })
  .then(function (result) {
    if (config.isVerbose() && result) {
      const text = json.stringify(result).split('\n');
      logger.debug('Finish');
      _.forEach(text, function (s) {
        logger.debug('  %s', s);
      });
    }
    if (result && result.hashCode) {
      logger.info('Code: %s', result.hashCode);
    }
    if (result && result.message) {
      logger.info(result.message);
    }
    if (result && result.duration) {
      logger.info('Duration %s ms', result.duration);
    }
    if (result && result.exitCode) {
      logger.info('Exist Code %s', result.exitCode);
    }
    logger.info('');
  }, function (reason) {
    const text = json.stringify(reason).split('\n');
    logger.error('Error');
    _.forEach(text, function (s) {
      logger.error('%s', s);
    });
  });
