#!/usr/bin/env node

/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var actionLoader = require('./lib/action-loader');
var configure = require('./lib/configure');
var logger = require('./lib/logger');
var settings = require('./lib/settings');

var pkg = require('./package.json');

logger.info();
logger.info('%s (%s)', pkg.title, pkg.version);
logger.info();

// in verbose: show the parameters!
settings.print(function (content) {
  logger.debug(content);
});

logger.info('Project: %s', configure.get('name', '?'));
logger.info('Version: %s', configure.get('version', '0.0.0'));
logger.info('Home:    %s', process.cwd());
logger.info();

actionLoader.find(settings.getAction())
  .then(
    function (actionProvider) {
      return actionProvider.run();
    }
  )
  .then(
    function (result) {
      if (settings.isVerbose()) {
        logger.debug("Finish with %s", JSON.stringify(result));
      }
      if (result && result.hashCode) {
        logger.info('- Code: %s', result.hashCode);
      }
      if (result && result.message) {
        logger.info(result.message);
      }
      if (result && result.duration) {
        logger.info('- Duration %s ms', result.duration);
      }
      if (result && result.exitCode) {
        logger.info('- Exist Code %s', result.exitCode);
      }
      logger.info();
    },
    function (reason) {
       logger.error(JSON.stringify(reason));
    }
  );
