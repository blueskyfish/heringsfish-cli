/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/builder
 * @description
 * Builder for error and success messages
 *
 * @requires path
 * @requires util
 * @requires lodash
 * @requires module:hf/defines
 * @requires module:hf/core/json
 */

const path = require('path');
const util = require('util');

const _    = require('lodash');

const defines = require('lib/defines');
const json    = require('lib/core/json');

/**
 * Calculate a hash code from the string.
 *
 * @param {string|object} str if the parameter is not a string, then it convert into a JSON string.
 * @return {string} an hash code string
 */
module.exports.hashCode = function (str) {
  return hashCode_(str);
};

/**
 * Builds an error object. If the parameter `err` is an object, then try to get the message property from the object.
 * When call the function with more than 2 parameter, then it uses the util.format function to insert into the message.
 *
 * @param {null, object} err
 * @param {string} message the message / pattern
 * @return {ErrorMessage}
 */
module.exports.createError = function (err, message) {
  var args = Array.prototype.slice.call(arguments, 1);
  return errorBuilder_(err, message, args);
};

/**
 * Build a success message. If the parameter `beans` is defined, then it merges to the SuccessMessage. When call the
 * function with more than 2 parameter, then it uses the util.format function to insert into the message.
 *
 * @param {object} beans
 * @param {string} message
 * @return {SuccessMessage}
 */
module.exports.createSuccess = function (beans, message) {
  var args = Array.prototype.slice.call(arguments, 1);
  return successBuilder_(beans, message, args);
};

/**
 * Returns true if the value is a string and doesn't contain '' or '-'
 * @param {*} s
 * @return {boolean}
 */
module.exports.isDefined = function (s) {
  return (_.isString(s) && s !== '' && s !== '-')
};

/**
 * Returns the name of the project directory.
 *
 * @return {string|null} the parent directory name.
 */
module.exports.getProjectPathName = function () {
  var info = path.parse(defines.PROJECT_HOME);
  return info.name || null;
};

/**
 * Remove the prefix path name.
 * @param {string} pathname
 * @return {string}
 */
module.exports.shortPathName = function (pathname) {
  if (_.isString(pathname)) {
    if (_.startsWith(pathname, defines.HF_APP_HOME)) {
      return pathname.substr(defines.HF_APP_HOME.length);
    }
    if (_.startsWith(pathname, defines.PROJECT_HOME)) {
      return pathname.substr(_.size(defines.PROJECT_HOME));
    }
    return pathname;
  }
  return pathname;
};

/**
 * Remove the whitespaces and convert into lower case.
 * @param name
 * @return {*}
 */
module.exports.adjustPropertyName = function (name) {
  if (!_.isString(name)) {
    return name;
  }
  return name.replace(/[^a-zA-Z]/g, '-').replace(/--/, '-').toLowerCase();
};

//
// internal functions
//

function hashCode_(str) {
  var hash = 0;
  if (!_.isString(str)) {
    str = json.stringify(str);
  }

  if (str.length == 0) return hash;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash<<5) - hash) + char;
    hash = hash & 0xFFFFFFFF;
  }
  if (hash < 0) {
    hash = hash * -1;
  }
  return '0x' + hash.toString(16);
}

/**
 * @return {ErrorMessage}
 * @private
 */
function errorBuilder_(err, message, args) {
  var hashCode;

  if (_.size(args) > 1) {
    message = util.format.apply(util, args);
  }
  if (err && err.message) {
    message = util.format('%s (%s)', message, err.message);
  }

  hashCode = hashCode_(message);

  /**
   * @name ErrorMessage
   * @property {string} hashCode
   * @property {string} message
   */
  return {
    hashCode: hashCode,
    message: message
  };
}

/**
 * @return {SuccessMessage}
 * @private
 */
function successBuilder_(beans, message, args) {
  var hashCode;

  if (_.size(args) > 1) {
    message = util.format.apply(util, args);
  }

  hashCode = hashCode_(message);

  /**
   * @name SuccessMessage
   * @property {string} hashCode
   * @property {string} message;
   */

  /**
   * @type {SuccessMessage}
   */
  var successMessage = {
    hashCode: hashCode,
    message: message
  };

  if (beans) {
    return _.merge({}, beans, successMessage);
  }
  return successMessage;
}
