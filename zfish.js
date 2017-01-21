#!/usr/bin/env node

/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * Entry point of heringsfish zfish :-)
 */
(function (appHomePath, projectHomePath, args) {

  const appModulePath = require('app-module-path');

  appModulePath.addPath(appHomePath);
  appModulePath.addPath(projectHomePath);

  const app      = require('hf/heringsfish');
  const executor = require('hf/kernel/executor');

  app.init(appHomePath, projectHomePath, args)
    .then(function (options) {
      return executor(options);
    })
    .then(function (result) {

      if (result && result.message) {
        app.options.logInfo(result.message);
      }
      if (result && result.duration) {
        app.options.logInfo('Duration: %s ms', result.duration);
      }

      // exit code 0 !
      process.exit(0);

    })
    .catch(function (reason) {
      // show the error message
      if (reason && reason.message) {
        app.options.logError(reason.message);
      }
      if (reason && reason.code) {
        app.options.logError('Code: 0x%s', reason.code.toString(16));
      }
      if (reason && reason.stack) {
        app.options.logError('Stack: %s', reason.stack);
      }

      // exit code -> reason.existCode
      const exitCode = reason.exitCode || 1;
      process.exit(exitCode);
    });

} (__dirname, process.cwd(), process.argv.slice(2)));
