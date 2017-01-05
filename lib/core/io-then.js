/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const fs = require('fs');

const Q  = require('q');

const defines = require('lib/defines');
const builder = require('lib/core/builder');

/**
 * Check whether the path or file is existing. The promise resolves always. In case of path or file exist, the
 * resolve callback parameter is true.
 *
 * ```js
 * ioThen.exist('/home/user').then(
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
 * @return {promise}
 */
module.exports.exists = function (pathname) {
  var done = Q.defer();
  fs.stat(pathname, function (err) {
    if (err) {
      return done.resolve(false);
    }
    done.resolve(true);
  });
  return done.promise;
};


/**
 * Check whether the path or file is existing. The promise resolves always. In case of path or file exist, the
 * resolve callback parameter is true.
 *
 * ```js
 * ioThen.exist('/home/user').then(
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
module.exports.exists = function (pathname) {
  var done = Q.defer();
  fs.stat(pathname, function (err) {
    if (err) {
      return done.resolve(false);
    }
    done.resolve(true);
  });
  return done.promise;
};

/**
 * Try to read a filename. In case of success the promise resolve callback parameter contains the content.
 *
 * ```js
 * ioThen.readFile('settings.json').then(
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
module.exports.readFile = function (filename) {
  var done = Q.defer();
  fs.readFile(filename, defines.FILE_ENCODING, function (err, content) {
    if (err) {
      return done.reject(builder.createError(err, 'Error occurred at "%s"!', filename));
    }
    done.resolve(content);
  });
  return done.promise;
};

/**
 * Try to read a file and parse the content into a JSON object. In case of succes, the promise resolve callback
 * parameter has the JSON object.
 *
 * @param {string} filename the filename of the JSON object.
 * @return {promise}
 */
module.exports.readJson = function (filename) {
  const that = this;
  return that.readFile(filename)
    .then(function (content) {
      try {
        return JSON.parse(content);
      } catch (e) {
        return Q.reject(builder.createError(e, 'Content is not a valid JSON (%s)', filename));
      }
    });
};

/**
 * Try to read a file and parse the content into a JSON object. In case of an error the method returns null.
 *
 * @param {string} filename
 * @return {object|null}
 */
module.exports.readJsonSync = function (filename) {
  try {
    var content = fs.readFileSync(filename, defines.FILE_ENCODING);
    return JSON.parse(content);
  } catch (e) {
    if (e.stack) {
      console.error(e);
    }
    return null;
  }
};

/**
 * Try to writes the content into the file.
 * @param {String} filename the filename
 * @param {Object|String} data the content
 * @return {promise}
 */
module.exports.writeFile = function (filename, data) {
  if (!_.isString(data)) {
    data = JSON.stringify(data, null, 3);
  }
  var done = Q.defer();
  fs.writeFile(filename, data, defines.FILE_ENCODING, function (err) {
    if (err) {
      return done.resolve(false);
    }
    done.resolve(true);
  });

  return done.promise;
};

module.exports.writeJsonSync = function (filename, data) {
  if (_.isObject(data)) {
    data = JSON.stringify(data, null, 3);
  }
  fs.writeFileSync(filename, data, defines.FILE_ENCODING);
};
