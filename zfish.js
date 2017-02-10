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

  const _ = require('lodash');
  const appModulePath = require('app-module-path');

  appModulePath.addPath(appHomePath);
  appModulePath.addPath(projectHomePath);

  const app = require('hf/heringsfish');

  app.init(appHomePath, projectHomePath, args)
    .then(function (options) {
      return app.execute(options);
    })
    .then((result) => {
      app.success(result);
    })
    .catch((reason) => {
      app.failure(reason);
    });

} (__dirname, process.cwd(), process.argv.slice(2)));
