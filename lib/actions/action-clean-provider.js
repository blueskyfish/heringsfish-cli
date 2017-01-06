/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const logger = require('lib/logger');
const config = require('lib/config');
const runner = require('lib/runner');

const json   = require('lib/core/json');

/**
 * @type {ActionInfo}
 */
const mInfo = {
  action: 'clean',
  description: 'Executes the maven goal "clean" in order to clean the deployment directories.'
};

/**
 * @type {ActionProvider}
 */
module.exports = {

  run: function () {
    return run_();
  },

  info: function () {
    return mInfo;
  }
};

function run_() {
  return runner.getMavenSettingValues()
    .then(function (mavenSetting) {
      // mvn -f ./projects/pom.xml package -DskipTests=true
      var params = [
        '-f', mavenSetting.project
      ];
      if (mavenSetting.setting) {
        params.push('-s', mavenSetting.setting);
      }
      params.push('clean');

      if (config.isVerbose()) {
        logger.debug('%s %s', mavenSetting.maven, json.stringify(params));
      }

      return runner.execute(mavenSetting.maven, params);
    });
}
