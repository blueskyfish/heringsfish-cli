/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/plugin/build-project
 * @description
 * Starts the building of the project with maven
 *
 * @requires module:hf/core/maven
 */

const maven = require('hf/core/maven');

/**
 * Starts the building of the project with maven
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports = function (options) {
  return maven.buildProject(options);
};
