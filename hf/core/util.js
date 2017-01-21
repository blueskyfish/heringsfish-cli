/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/utils
 * @description
 * Small util library
 *
 * @requires lodash
 */

const _ = require('lodash');

/**
 * Returns true if the value is a string and doesn't contain '' or '-'.
 *
 * @param {*} s
 * @return {boolean}
 */
module.exports.hasStringValue = function (s) {
  return (_.isString(s) && s !== '' && s !== '-')
};
