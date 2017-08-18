/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/io
 * @description
 * Simple async (promisified) function.
 *
 * @requires fs
 * @requires util
 * @requires q
 * @requires module:hf/defines
 */

const fs      = require('fs');
const path    = require('path');
const util    = require('util');

const _       = require('lodash');

const DEFINES = require('hf/defines');

/**
 * Check whether the path or file is existing. The promise resolves always.
 *
 * In case of file exist, the resolve callback parameter is true.
 *
 * ```js
 * io.hasFile('/home/user').then(
 *   function (fileExist) {
 *     if (fileExist) {
 *       console.log('The path "/home/user" exists');
 *     } else {
 *       console.log('Where is the path "/user/home"?');
 *     }
 *   }
 * );
 * ```
 *
 * @param {string} filename the path or file name.
 * @return {Promise<Boolean>}
 */
module.exports.hasFile = function (filename) {
  return new Promise(function _hasFile(resolve) {
    fs.stat(filename, (err) => {
      if (err) {
        return resolve(false);
      }
      resolve(true);
    });

  });
};

/**
 * Try to read a filename. In case of success the promise resolve callback parameter
 * contains the content.
 *
 * | Error    | Message
 * |----------|--------------------------
 * | 0xff1001 | File "x" is not found
 *
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
 * @param {String} filename the filename
 * @return {Promise<String>}
 */
module.exports.readFile = function (filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, DEFINES.FILE_ENCODING, (err, content) => {
      if (err) {
        return reject({
          code: 0xff1001,
          message: util.format('File "%s" is not found (%s)', path.basename(filename), err.message || '?')
        });
      }
      resolve(content);
    });
  });
};

/**
 * Reads the content from the given filename.
 *
 * If the file is not existed, then it call promise resolve with null, otherwise with
 * the content.
 *
 * @param {String} filename the filename
 * @return {Promise<String|null>}
 */
module.exports.readContent = function (filename) {
  return new Promise((resolve) => {
    fs.readFile(filename, DEFINES.FILE_ENCODING, (err, content) => {
      if (err) {
        return resolve(null);
      }
      resolve(content);
    });
  });
};

/**
 * Try to read a file and parse the content into a JSON object. In case of succes, the promise resolve callback
 * parameter has the JSON object.
 *
 * | Error    | Message
 * |----------|--------------------------
 * | 0xff1001 | File "x" is not found
 * | 0xff1002 | File "x" is not a valid JSON
 *
 * @param {string} filename the filename of the JSON object.
 * @param {Boolean} [strictReading] when the parameter is true, the method "readFile" is use instead the "readContent"
 * @return {Promise<Object>}
 */
module.exports.readJson = function (filename, strictReading) {
  const that = this;

  function _parseContent(content) {
    try {
      return JSON.parse(content);
    } catch (e) {
      return strictReading === true ? Promise.reject({
          code: 0xff1002,
          message: util.format('File "%s" is not a valid JSON (%s)', path.basename(filename), e.message || '?'),
          stack: e.stack || null
        }) : {};
    }
  }

  return strictReading === true ?
    that.readFile(filename).then(_parseContent) :
    that.readContent(filename).then(_parseContent);
};

/**
 * Writes the content to the file.
 *
 * @param {String} filename
 * @param {*} data
 * @return {Promise<Object>}
 */
module.exports.writeFile = function (filename, data) {
  return new Promise((resolve, reject) => {
    if (!_.isString(data)) {
      data = JSON.stringify(data, null, 2);
    }
    fs.writeFile(filename, data, DEFINES.FILE_ENCODING, (err) => {
      if (err) {
        reject({
          code: 0xff1003,
          message: util.format('File "%s" could not write (%s)', path.basename(filename), err.message || '?')
        });
      }
      resolve({
        message: util.format('File "%s" is saved', path.basename(filename))
      });
    });
  });
};
