/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/maven
 * @description
 *
 * @requires path
 */

const path    = require('path');

const _       = require('lodash');

const os      = require('hf/core/os');
const utils   = require('hf/core/utils');

/**
 * @name MavenSetting
 * @property {string} maven the maven command line
 * @property {string} project the filename to the pom.xml
 * @property {string} setting the filename to the maven settings
 */

class MavenParams {

  constructor() {
    /**
     * A list of parameters
     *
     * @type {Array<String>}
     */
    this.params = [];
  }

  /**
   * Adds the project pom.xml to the parameter list
   *
   * @param {String} project the pom.xml
   * @return {MavenParams}
   */
  addProject(project) {
    if (_.isString(project)) {
      this.params.push('-f', project);
    }
    return this;
  }

  /**
   * Add the setting file to the parameter list
   *
   * @param {String|null} setting the setting filename
   * @return {MavenParams}
   */
  addSetting(setting) {
    if (!!setting && _.isString(setting)) {
      this.params.push('-s', setting);
    }
    return this;
  }

  /**
   * Add the profiles to the parameter list if any.
   *
   * @param {String|null} profiles
   * @return {MavenParams}
   */
  addProfiles(profiles) {
    if (!!profiles && _.isString(profiles)) {
      this.params.push('-P', profiles);
    }
    return this;
  }

  /**
   * Adds a new parameter to the list.
   *
   * @param {String} param
   * @return {MavenParams}
   */
  add(param) {
    if (_.isString(param)) {
      this.params.push(param);
    }
    return this;
  }

  /**
   * Adds a new parameter to the list when the condition is true.
   *
   * @param {Boolean} condition
   * @param {String} param
   * @return {MavenParams}
   */
  addIf(condition, param) {
    if (condition === true && _.isString(param)) {
      this.params.push(param);
    }
    return this;
  }

  /**
   * Returns a list of parameters for the maven command
   * @return {Array}
   */
  build() {
    const args = [];
    _.forEach(this.params, (param) => {
      args.push(param);
    });
    return args;
  }
}

/**
 * Creates a instance of the Maven parameters
 *
 * @return {MavenParams}
 */
module.exports.newParams = function () {
  return new MavenParams();
};


/**
 * Get the maven settings
 *
 * @param {Options} options
 * @return {Promise<MavenSetting>}
 */
module.exports.getMavenSetting = function (options) {
  return new Promise((resolve, reject) => {
    const messages = [];
    const mavenCommand = path.normalize(options.parseValue(options.getConfig('command.maven', null, true)));
    const mavenProject = path.normalize(options.parseValue(options.getConfig('maven.project', 'pom.xml')));
    const mavenSettingFile = path.normalize(options.parseValue(options.getConfig('maven.setting', null)));
    if (!utils.hasStringValue(mavenCommand)) {
      messages.push('Setting "command.maven" is required!');
    }
    if (!utils.hasStringValue(mavenProject)) {
      messages.push('Setting "maven.project" is required');
    }
    if (_.size(messages) > 0) {
      // logs the error messages
      _.forEach(messages, function (message) {
        options.logError(message);
      });

      return reject({
        code: 0xff00f1,
        message: 'Missing Maven settings'
      });
    }

    /** @type {MavenSetting} */
    const mavenSetting = {
      maven: mavenCommand,
      project: mavenProject,
      setting: utils.hasStringValue(mavenSettingFile) ? mavenSettingFile : null
    };

    if (options.isVerbose()) {
      options.logDebug('maven settings: %s', JSON.stringify(mavenSetting));
    }

    return resolve(mavenSetting);
  });
};


/**
 * Executes the building of the project
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports.buildProject = function (options) {
  const that = this;
  return that.getMavenSetting(options)
    .then((mavenSetting) => {
      const params = that.newParams()
        .addProject(mavenSetting.project)
        .addSetting(mavenSetting.setting)
        .addIf(options.isParam('c', 'clean'), 'clean')
        .add('package')
        .addIf(options.isParam('skip', 'notest'), '-DskipTests=true')
        .addProfiles(options.getParamByNames('p', 'profiles', null))
        .build();

      options.logDebug('Building: %s %s', path.basename(mavenSetting.maven), params.join(' '));

      return os.exec(options, mavenSetting.maven, params);
    });
};

/**
 * Executes the testing of the project
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports.testProject = function (options) {
  const that = this;
  return that.getMavenSetting(options)
    .then((mavenSetting) => {
      const params = that.newParams()
        .addProject(mavenSetting.project)
        .addSetting(mavenSetting.setting)
        .addIf(options.isParam('c', 'clean'), 'clean')
        .add('test')
        .addProfiles(options.getParamByNames('p', 'profiles', null))
        .build();

      options.logDebug('Testing: %s %s', path.basename(mavenSetting.maven), params.join(' '));

      return os.exec(options, mavenSetting.maven, params);
    });
};

/**
 * Executes the cleaning of the project
 *
 * @param {Options} options
 * @return {Promise<RunResult>}
 */
module.exports.cleanProject = function (options) {
  const that = this;
  return that.getMavenSetting(options)
    .then((mavenSetting) => {
      const params = that.newParams()
        .addProject(mavenSetting.project)
        .addSetting(mavenSetting.setting)
        .add('clean')
        .build();

      options.logDebug('Testing: %s %s', path.basename(mavenSetting.maven), params.join(' '));

      return os.exec(options, mavenSetting.maven, params);
    });
};
