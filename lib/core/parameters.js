/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const path = require('path');

const _    = require('lodash');


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
 * @param args
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
