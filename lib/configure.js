/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var fs = require('fs');
var path = require('path');

var _ = require('lodash');

var logger = require('./logger');
var settings = require('./settings');
var utilities = require('./utilities');


var CONFIG_FILENAME = 'server-config.json';

var mConfig = _readConfigSettings();


module.exports = {

  /**
   * Stores the configuration value
   *
   * @param {string} name the key name
   * @param {string|number|boolean} value the value of the key
   */
  save: function (name, value) {
    save_(name, value)
  },

  /**
   * Delete the key from the configuration
   * @param {string} name
   */
  delete: function (name) {
    delete_(name);
  },

  /**
   * Returns the value of the config name.
   *
   * @param {string} name
   * @param {string|number|boolean|null} defValue
   * @param {boolean} [checkPlatform] if a value is depend on a platform, then it use the value `true`
   * @return {*}
   */
  get: function (name, defValue, checkPlatform) {
    return get_(name, defValue, checkPlatform);
  },

  /**
   * Adjust and expand the pathname.
   *
   * @param {string} pathname
   * return {string}
   * @deprecated Please use the method {@link #adjustValue}
   */
  adjustPath: function (pathname) {
    logger.warn('adjustPath is deprecated. Please use "adjustValue" instead!');
    return adjustValue_(pathname);
  },

  /**
   * Adjust and expand the value.
   *
   * @param {string} value the value for adjust
   * @return {string} the expended value
   */
  adjustValue: function (value) {
    return adjustValue_(value);
  },

  reload: function () {
    mConfig = null;
    mConfig = _readConfigSettings();
  },

  print: function () {
    print_();
  },

  /**
   * Returns the complete config setting filename.
   * @return {string}
   */
  getFilename: function () {
    return getFilename_();
  },

  /**
   * Replace the config setting with new settings. It writes the config settings back to the file.
   *
   * @param {object} config
   */
  replace: function (config) {
    mConfig = config;
    _writeConfig(mConfig);
  }
};

function save_(name, value) {
  var origin = value;
  try {
    value = value || '';
    value = _.isString(value) ? value.trim() : value;
    // try to find the type
    if (/^true$/i.test(value)) {
      value = true;
    } else if (/^false$/i.test(value)) {
      value = false;
    } else if (/^d+$/.test(value)) {
      value = parseInt(value, 10);
    }
  } catch (e) {
    logger.error(e.stack);
    value = origin;
  }
  _.set(mConfig, name, value);
  _writeConfig(mConfig);
}

function delete_(name) {
  mConfig = _.omit(mConfig, name);
  _writeConfig(mConfig);
}

function get_(name, defValue, checkPlatform) {
  var formerName = name;
  if (checkPlatform === true) {
    name += process.platform === 'win32' ? '.win32' : '.unix';
  }
  if (!_.has(mConfig, name)) {
    name = formerName;
  }
  return _.get(mConfig, name, defValue);
}

function adjustValue_(pathname) {
  if (_.isString(pathname)) {
    return pathname.replace(/\{(.+)}/g, function (text, key) {
      key = key || '';
      switch (key.toLowerCase()) {
        case 'user.home':
          return settings.getHomePath();
        case 'project.home':
          return process.cwd();
        case 'server.home':
          return adjustValue_(get_('server.home', ''));
        case 'domain.name':
          return get_('domain.name', 'domain1');
        case 'domain.home':
          return adjustValue_(get_('domain.home', process.cwd()));
        case 'project.version':
        case 'version':
          return get_('version', '0.0.0');
        case 'project.name':
        case 'name':
          return get_('name', text);
        default:
          return text;
      }
    });
  }
  return pathname;
}

function getFilename_() {
  return path.join(process.cwd(), CONFIG_FILENAME);
}

function _readConfigSettings() {
  var filename = getFilename_();
  var config = utilities.readJsonSync(filename);

  config = config || {};
  config.loadTime = Date.now();

  return config;
}

function _writeConfig(config) {
  var filename = getFilename_();
  fs.writeFileSync(filename, JSON.stringify(config, null, 2), 'utf8');
}

function print_() {
  logger.info('Project Configuration:');
  if (_.size(mConfig) === 0) {
    logger.info('  Empty configuration!')
  }
  var indent = 0;
  logger.info('{');
  _.forEach(mConfig, function (value, name) {
    if (_.isArray(value)) {
      _printArray(indent, name, value);
    } else if (_.isObject(value)) {
      _printObject(indent, name, value);
    } else {
      _printValue(indent, name, value);
    }
  });
  logger.info('}');
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
