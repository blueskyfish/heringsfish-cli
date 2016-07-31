/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var path = require('path');

var _ = require('lodash');
var minimist = require('minimist');

/**
 * The object contains the arguments of the node module.
 *
 * @type {Parameters}
 */
var mParams =_initialParameters();

module.exports = {

  /**
   * Returns the argument settings. The `name` parameter is either a number or a string. Depending on the type of the
   * parameter either the list or options is used to determine the value.
   *
   * @param {string|number} name determines whether the list or the options are used.
   * @param {*} defValue the default value if the name is not exist.
   * @return {*}
   */
  getSetting: function (name, defValue) {
    return getSetting_(name, defValue);
  },

  isVerbose: function () {
    return mParams.verbose;
  },

  isQuiet: function () {
    return mParams.quiet;
  },

  isSetting: function (shortName, longName) {
    return getSetting_(shortName, false) || getSetting_(longName, false);
  },

  /**
   * Returns the arguments value.
   * @param {string} shortName
   * @param {string} longName
   * @param {string|null} defValue
   * @return {string|null}
   */
  getSettingByNames: function (shortName, longName, defValue) {
    return getSetting_(shortName, null) || getSetting_(longName, null) || defValue;
  },

  getAction: function () {
    return getAction_();
  },

  print: function (callback) {
    if (_.isFunction(callback)) {
      callback(JSON.stringify(mParams));
    }
  },

  /**
   * Returns the size of the list parameter.
   * @return {number}
   */
  getListParameterSize: function () {
    return _.size(mParams.list);
  }
};

function getSetting_(name, defValue) {
  if (_.isNumber(name)) {
    return mParams.list[name] || defValue;
  }
  return mParams.options[name] || defValue;
}

function getAction_() {
  return mParams.action;
}

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
 * @return {Parameters}
 * @private
 */
function _initialParameters() {
  var args = minimist(process.argv.slice(2));
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
  return params;
}
