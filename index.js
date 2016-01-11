#!/usr/bin/env node

/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';


var actionLoader = require('./lib/action-loader');
var logger = require('./lib/logger');
var settings = require('./lib/settings');
var utilities = require('./lib/utilities');

var pkg = require('./package.json');

logger.info('%s (%s)', pkg.title, pkg.version);
logger.info();

// in verbose: show the parameters!
settings.print(function (content) {
  logger.debug(content);
});

logger.info('Project: %s', utilities.getExecuteHome());

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
        logger.info(' [%s]', result.hashCode);
      }
      if (result && result.message) {
        logger.info(result.message);
      }
      if (result && result.duration) {
        logger.info('Duration %s ms', result.duration || -1);
      }
      if (result && result.exitCode) {
        logger.info('Exist Code %s', result.exitCode || 0);
      }
    },
    function (reason) {
      if (reason.stack) {
        logger.error(reason.stack);
      }
      logger.error(JSON.stringify(reason));
    }
  );