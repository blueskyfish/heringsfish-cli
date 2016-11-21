/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');

var _ = require('lodash');
var Q = require('q');


/**
 * The home directory of the node module.
 *
 * @type {string}
 */
var mExecuteHome = path.normalize(path.join(__dirname, '..'));


module.exports = {

  /**
   * Check whether the path or file is existing. The promise resolves always. In case of path or file exist, the
   * resolve callback parameter is true.
   *
   * ```js
   * utilities.exist('/home/user').then(
   *   function (pathExist) {
   *     if (pathExist) {
   *       console.log('The path "/home/user" exists');
   *     } else {
   *       console.log('Where is the path "/user/home"?');
   *     }
   *   }
   * );
   * ```
   *
   * @param {string} pathname the path or file name.
   * @return {Q.promise}
   */
  exists: function (pathname) {
    return exists_(pathname);
  },

  /**
   * Try to read a filename. In case of success the promise resolve callback parameter contains the content.
   *
   * ```js
   * utilities.readFile('settings.json').then(
   *   function (content) {
   *     return JSON.parse(content);
   *   },
   *   function (reason) {
   *     console.error(reason.message);
   *   }
   * );
   * ```
   *
   * @param {string} filename the filename
   * @return {Q.promise}
   */
  readFile: function (filename) {
    return readFile_(filename);
  },

  /**
   * Try to read a file and parse the content into a JSON object. In case of succes, the promise resolve callback
   * parameter has the JSON object.
   *
   * @param {string} filename the filename of the JSON object.
   * @return {Q.promise}
   */
  readJson: function (filename) {
    return readJson_(filename);
  },

  /**
   * Try to read a file and parse the content into a JSON object. In case of an error the method returns null.
   *
   * @param {string} filename
   * @return {object|null}
   */
  readJsonSync: function (filename) {
    return readJsonSync_(filename);
  },

  writeFile: function (filename, data) {
    return writeFile_(filename, data);
  },


  /**
   * Calculate a hash code from the string.
   *
   * @param {string|object} str if the parameter is not a string, then it convert into a JSON string.
   * @return {string} an hash code string
   */
  hashCode: function (str) {
    return hashCode_(str);
  },

  /**
   * Builds an error object. If the parameter `err` is an object, then try to get the message property from the object.
   * When call the function with more than 2 parameter, then it uses the util.format function to insert into the message.
   *
   * @param {null, object} err
   * @param {string} message the message / pattern
   * @return {ErrorMessage}
   */
  error: function (err, message) {
    var args = Array.prototype.slice.call(arguments, 1);
    return errorBuilder_(err, message, args);
  },

  /**
   * Build a success message. If the parameter `beans` is defined, then it merges to the SuccessMessage. When call the
   * function with more than 2 parameter, then it uses the util.format function to insert into the message.
   *
   * @param {object} beans
   * @param {string} message
   * @return {SuccessMessage}
   */
  success: function (beans, message) {
    var args = Array.prototype.slice.call(arguments, 1);
    return successBuilder_(beans, message, args);
  },

  /**
   * Returns true if the value is a string and doesn't contain '' or '-'
   * @param {*} s
   * @return {boolean}
   */
  isDefined: function (s) {
    return (_.isString(s) && s !== '' && s !== '-')
  },

  /**
   * Returns the name of the project directory
   * @return {string}
   */
  getProjectPathName: function () {
    return getProjectPathName_();
  },

  /**
   * Remove the prefix path name.
   * @param {string} pathname
   * @return {string}
   */
  shortPathName: function (pathname) {
    if (_.isString(pathname)) {
      if (_.startsWith(pathname, mExecuteHome)) {
        return pathname.substr(mExecuteHome.length);
      }
      if (_.startsWith(pathname, process.cwd())) {
        return pathname.substr(_.size(process.cwd()));
      }
      return pathname;
    }
    return pathname;
  },

  /**
   * Returns the home directory of the node Module
   *
   * @return {string}
   */
  getExecuteHome: function () {
    return mExecuteHome;
  },

  /**
   * Remove the whitespaces and convert into lower case.
   * @param name
   * @return {*}
   */
  adjustPropertyName: function (name) {
    if (!_.isString(name)) {
      return name;
    }
    return name.replace(/[^a-zA-Z]/g, '-').replace(/--/, '-').toLowerCase();
  }
};

function exists_(pathname) {
  var done = Q.defer();
  fs.stat(pathname, function (err) {
    if (err) {
      return done.resolve(false);
    }
    done.resolve(true);
  });
  return done.promise;
}

function readFile_(filename) {
  var done = Q.defer();
  fs.readFile(filename, 'utf8', function (err, content) {
    if (err) {
      return done.reject(errorBuilder_(err, 'Error occurred at "%s"!', filename));
    }
    done.resolve(content);
  });
  return done.promise;
}

function readJsonSync_(filename) {
  try {
    var content = fs.readFileSync(filename, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    if (e.stack) {
      console.error(e);
    }
    return null;
  }
}

function readJson_(filename) {
  return readFile_(filename)
    .then(function (content) {
      try {
        return JSON.parse(content);
      } catch (e) {
        return Q.reject(errorBuilder_(e, 'Content is not a valid JSON (%s)', filename));
      }
    });
}

function writeFile_(filename, data) {
  if (!_.isString(data)) {
    data = JSON.stringify(data, null, 3);
  }
  var done = Q.defer();
  fs.writeFile(filename, data, 'utf8', function (err) {
    if (err) {
      return done.resolve(false);
    }
    done.resolve(true);
  });

  return done.promise;
}

function hashCode_(str) {
  var hash = 0;
  if (!_.isString(str)) {
    str = JSON.stringify(str);
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

function getProjectPathName_() {
  var info = path.parse(process.cwd());
  return info.name || 'unknown??';
}
