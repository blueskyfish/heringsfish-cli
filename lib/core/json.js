/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/json
 * @description
 * Wrapper for the JSON interface
 */

/**
 *
 * @type {number}
 */
const INDENT_SIZE = 3;

/**
 * Parses the string into the json object.
 *
 * @param {String} text the json text.
 * @param {Object} [defValue]
 * @return {Object}
 */
module.exports.parse = function (text, defValue) {
  try {
    return JSON.parse(text);
  } catch (e) {
    if (e.stack) {
      console.error(e);
    }
    return defValue || null;
  }
};

/**
 * Converts the json object into an string.
 *
 * @param {*} data
 * @return {String}
 */
module.exports.stringify = function (data) {
  return JSON.stringify(data, null, INDENT_SIZE);
};
