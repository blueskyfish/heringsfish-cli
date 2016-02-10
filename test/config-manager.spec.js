/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var assert = require('assert');

var _ = require('lodash');

var configure = require('../lib/configure');
var settings = require('../lib/settings');

describe('Configuration Manager:', function () {

  it('Should resolve the Home Path of the user', function () {
    var userPath = settings.getHomePath();
    var result = configure.adjustValue('{user.home}/bin/test');
    console.log('user:   %s', userPath);
    console.log('result: %s', result);
    assert(_.startsWith(result, userPath));
  });

});