/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/heringsfish
 *
 */

const colors = require('colors');

colors.setTheme({
  debug: 'green',
  info:  'blue',
  warn:  'magenta',
  error: 'red'
});


/**
 * Initialize the heringsfish app.
 *
 * @param {String} appHomePath the path to the heringsfish application
 * @param {String} projectHomePath the project home path
 * @param {Array<String>} args the program arguments
 * @return {Promise<Options>}
 */
module.exports.init = function (appHomePath, projectHomePath, args) {

  const that = this;

  // update and initialize the definitions
  const DEFINES  = require('hf/defines');

  DEFINES.PROJECT_PATH = projectHomePath;
  DEFINES.APPLICATION_PATH = appHomePath;

  const startup  = require('hf/kernel/startup');
  const Options  = require('hf/kernel/options');

  // parse the parameters and reads the server configuration
  const params   = startup.parseArguments(args);
  const pkg      = startup.readAppPackage(appHomePath);

  return startup.readConfiguration(appHomePath, projectHomePath, DEFINES.USER_HOME_PATH)
    .then(function (configs) {

      const options = new Options(params, configs);

      // app instance
      Object.defineProperty(that, 'options', {
        enumerable: true,
        value: options,
        configurable: true
      });

      return options
        .log('')
        .log('%s (%s)', pkg.title, pkg.version)
        .log('')
        .log('Project: %s', options.getConfig('name', '?'))
        .log('Version: %s', options.getConfig('version', '0.0.0'))
        .log('Home:    %s', projectHomePath)
        .log('')
        .log('User:    %s', DEFINES.USER_HOME_PATH)
        .log('HF Path: %s', appHomePath)
        .log('');
    });

};
