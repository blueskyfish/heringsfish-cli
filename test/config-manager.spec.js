/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

require('app-module-path').addPath(__dirname + '/..');

var assert = require('assert');

var _ = require('lodash');

var configure = require('lib/configure');
var defines = require('lib/defines');

describe('Configuration Manager:', function () {

  it('Should resolve the Home Path of the user', function () {
    var result = configure.adjustValue('{user.home}/bin/test');
    console.log('user:   %s', defines.USER_HOME_PATH);
    console.log('result: %s', result);
    assert(_.startsWith(result, defines.USER_HOME_PATH));
  });

});
