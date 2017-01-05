/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const path = require('path');

const _          = require('lodash');
const minimist   = require('minimist');

const parameters = require('lib/core/parameters');

/**
 * The object contains the arguments of this program.
 *
 * @type {Parameters}
 */
const mParams = parameters.parseArguments(minimist(process.argv.slice(2)));

/**
 * Returns the argument settings. The `name` parameter is either a number or a string. Depending on the type of the
 * parameter either the list or options is used to determine the value.
 *
 * @param {string|number} name determines whether the list or the options are used.
 * @param {*} defValue the default value if the name is not exist.
 * @return {*}
 */
module.exports.getSetting = function (name, defValue) {
  return getSetting_(name, defValue);
};

/**
 * Returns the verbose state.
 *
 * @return {boolean}
 */
module.exports.isVerbose = function () {
  return mParams.verbose;
};

/**
 * Returns the quite state.
 *
 * @return {boolean}
 */
module.exports.isQuiet = function () {
  return mParams.quiet;
};

/**
 * Checks the state of the given short or long argument.
 *
 * ```js
 * if (settings.isSetting('v', 'verbose')) {
 *   // verbose is on
 * }
 * ```
 *
 * @param {String} shortName the short name of the argument
 * @param {String} longName the long name of the argument
 * @return {Boolean}
 */
module.exports.isSetting = function (shortName, longName) {
  return getSetting_(shortName, false) || getSetting_(longName, false);
};


/**
 * Returns the arguments value.
 *
 * @param {string} shortName the short name of the argument
 * @param {string} longName the long name of the argument
 * @param {string|null} defValue
 * @return {string|null}
 */
module.exports.getSettingByNames = function (shortName, longName, defValue) {
  return getSetting_(shortName, null) || getSetting_(longName, null) || defValue;
};

module.exports.getAction = function () {
  return mParams.action;
};

module.exports.print = function (callback) {
  if (_.isFunction(callback)) {
    callback(JSON.stringify(mParams));
  }
};

/**
 * Returns the size of the list parameter.
 * @return {number}
 */
module.exports.getListParameterSize = function () {
  return _.size(mParams.list);
};

function getSetting_(name, defValue) {
  if (_.isNumber(name)) {
    return mParams.list[name] || defValue;
  }
  return mParams.options[name] || defValue;
}
