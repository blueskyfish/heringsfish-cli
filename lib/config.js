/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/config
 * @description
 * Manages the arguments of the program and the configuration of the server.
 *
 * @requires lodash
 * @requires minimist
 * @requires module:hf/defines
 * @requires module:hf/logger
 * @requires module:hf/core/loader
 * @requires module:hf/core/json
 */

const _        = require('lodash');
const minimist = require('minimist');

const defines  = require('lib/defines');
const logger   = require('lib/logger');
const loader   = require('lib/core/loader');
const json     = require('lib/core/json');

/**
 * The object contains the server configuration
 *
 * @type {Object}
 */
const M_CONFIG = loader.readConfiguration();

/**
 * The object contains the arguments of this program.
 *
 * @type {Parameters}
 */
const M_PARAMS = loader.parseArguments(minimist(process.argv.slice(2)));

/**
 * Returns the value of the configuration property from the given name.
 *
 * @param {string} name
 * @param {string|number|boolean|null} defValue
 * @param {boolean} [checkPlatform] if a value is depend on a platform, then it use the value `true`
 * @return {*}
 */
module.exports.getConfig = function (name, defValue, checkPlatform) {
  const formerName = name;
  if (checkPlatform === true) {
    name += defines.IS_WIN  ? '.win32' : '.unix';
  }
  if (!_.has(M_CONFIG, name)) {
    name = formerName;
  }
  return _.get(M_CONFIG, name, defValue);
};

/**
 * Adjust and expand the value.
 *
 * @param {string} value the value for adjust
 * @return {string} the expended value
 */
module.exports.parseValue = function (value) {
  const that = this;
  if (_.isString(value)) {
    return value.replace(/\{(.+)}/g, function (text, key) {
      key = key || '';
      switch (key.toLowerCase()) {
        case 'user.home':
          return defines.USER_HOME_PATH;
        case 'project.home':
          return defines.PROJECT_HOME;
        case 'server.home':
          return that.parseValue(that.getConfig('server.home', ''));
        case 'domain.name':
          return get_('domain.name', 'domain1');
        case 'domain.home':
          return that.parseValue(that.getConfig('domain.home', defines.PROJECT_HOME));
        case 'project.version':
        case 'version':
          return that.getConfig('version', '0.0.0');
        case 'project.name':
        case 'name':
          return that.getConfig('name', text);
        default:
          return text;
      }
    });
  }
  return value;
};

module.exports.printConfig = function () {
  logger.info('Project Configuration:');
  if (_.size(M_CONFIG) === 0) {
    logger.info('  Empty configuration!');
    return;
  }

  var indent = 0;
  logger.info('{');
  _.forEach(M_CONFIG, function (value, name) {
    if (_.isArray(value)) {
      _printArray(indent, name, value);
    } else if (_.isObject(value)) {
      _printObject(indent, name, value);
    } else {
      _printValue(indent, name, value);
    }
  });
  logger.info('}');
};


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
  return M_PARAMS.verbose;
};

/**
 * Returns the quite state.
 *
 * @return {boolean}
 */
module.exports.isQuiet = function () {
  return M_PARAMS.quiet;
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
  return M_PARAMS.action;
};

/**
 * Prints the arguments of the program.
 *
 * @param {Function} callback
 */
module.exports.printParameters = function (callback) {
  if (_.isFunction(callback)) {
    callback(json.stringify(M_PARAMS));
  }
};

/**
 * Returns the size of the list parameter.
 * @return {number}
 */
module.exports.getListParameterSize = function () {
  return _.size(M_PARAMS.list);
};


//
// internal function
//

function getSetting_(name, defValue) {
  if (_.isNumber(name)) {
    return M_PARAMS.list[name] || defValue;
  }
  return M_PARAMS.options[name] || defValue;
}


function _printValue(indent, name, value) {
  if (name) {
    logger.info('%s%s: %s', _indentSpace(indent), name, value);
  }
  else {
    logger.info('%s%s', _indentSpace(indent), value);
  }
}

function _printObject(indent, name, value) {
  if (name) {
    logger.info('%s%s: {', _indentSpace(indent), name);
  } else {
    logger.info('%s{', _indentSpace(indent));
  }
  _.forEach(value, function (v, name) {
    if (_.isArray(v)) {
      _printArray(indent + 1, name, v);
    } else if (_.isObject(v)) {
      _printObject(indent + 1, name, v);
    } else {
      _printValue(indent + 1, name, v);
    }
  });
  logger.info('%s}', _indentSpace(indent));
}

function _printArray(indent, name, value) {
  if (name) {
    logger.info('%s%s: [', _indentSpace(indent), name);
  } else {
    logger.info('%s[', _indentSpace(indent));
  }
  _.forEach(value, function (item) {
    if (_.isArray(item)) {
      _printArray(indent + 1, null, item);
    } else if (_.isObject(item)) {
      _printObject(indent + 1, null, item);
    } else {
      _printValue(indent + 1, null, item);
    }
  });
  logger.info('%s]', _indentSpace(indent));
}

function _indentSpace(indent) {
  if (indent <= 0) {
    return '   ';
  }
  return _.padStart('  ', (indent + 1) * 3, ' ');
}

