/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/loader
 * @description
 * Loads and reads the configuration and the program arguments
 *
 * @requires path
 * @requires lodash
 * @requires module:hf/defines
 * @requires module:hf/core/io-then
 */

const path    = require('path');

const _       = require('lodash');

const defines = require('lib/defines');
const ioThen  = require('lib/core/io-then');


/**
 * Filename of the server configuration.
 *
 * @type {string}
 */
const CONFIG_FILENAME = 'server-config.json';

/**
 * Reads the config server file from the project home directory.
 *
 * @return {Object}
 */
module.exports.readConfiguration = function () {
  const filename = _getConfigFilename();
  var config = ioThen.readJsonSync(filename);

  config = config || {};
  config.loadTime = Date.now();

  return config;
};


/**
 * @name Parameters
 * @description Contains the arguments of the node module
 * @property {string}        action
 * @property {boolean}       verbose
 * @property {boolean}       quiet
 * @property {object}        options
 * @property {Array<string>} list
 */

/**
 *
 * @param {Object} args
 * @return {Parameters}
 */
module.exports.parseArguments = function (args) {
  /** @type {Parameters} */
  var params = {
    verbose: false,
    quiet: false,
    action: 'help',
    options: {},
    list: {}
  };

  if (args.v || args.verbose) {
    params.verbose = true;
  }
  if (args.q || args.quiet) {
    params.quiet = true;
  }
  if (args.a || args.action || args._[0]) {
    params.action = args.a || args.action || args._[0];
  }
  params.options = {};
  _.forEach(args, function (value, name) {
    switch (name) {
      case 'a':
      case 'action':
      case 'v':
      case 'verbose':
      case 'q':
      case 'quiet':
        break;
      case '_':
        _.forEach(value, function (name) {
          params.options[name] = true;
        });
        params.list = value;
        break;
      default:
        params.options[name] = value;
        break;
    }
  });
  // adjust the parameters
  if (params.options[params.action]) {
    delete params.options[params.action];
  }
  var index = params.list.indexOf(params.action);
  if (index >= 0) {
    params.list.splice(index, 1);
  }
  // when the action is "help" don't set quiet to true.
  if (params.action === 'help') {
    params.quiet = false;
  }

  if (params.quiet) {
    // when quite, shut up verbose
    params.verbose = false;
  }

  return params;
};

//
// internal function
//

// get the config filename
function _getConfigFilename() {
  return path.join(defines.PROJECT_HOME, CONFIG_FILENAME);
}
