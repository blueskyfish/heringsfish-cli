/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var childProcess = require('child_process');
var path = require('path');
var util = require('util');

var _ = require('lodash');
var Q = require('q');

var configure = require('./configure');
var logger = require('./logger');
var settings = require('./settings');
var utilities = require('./utilities');

var spawn = childProcess.spawn;
var exec = childProcess.exec;

var DEFAULT_WAITING = 1200000; // 10 minutes

module.exports = {

  /**
   * Executes the command.
   *
   * ```js
   * var runner = require('./runner');
   * runner.execute('ls', ['-al'])
   *   .then(
   *     function (result) {
   *       console.log('duration %s ms', result.duration || -1);
   *     },
   *     function (reason) {
   *       console.log('duration %s ms', reason.duration || -1);
   *       console.log(reason.message);
   *     }
   *   );
   * ```
   *
   * @param {string} cmd the command
   * @param {Array<string>} args the arguments for the command
   * @param {Map<String, String>} [env] the environment variables
   * @return {Q.promise}
   */
  execute: function (cmd, args, env) {
    return execute_(cmd, args, env);
  },

  /**
   * Returns the setting values for ASADMIN. In case of success the promise then part call a
   * function AsAdminSetting parameter.
   *
   * @param {boolean} [includeAdminPort]
   * @return {Q.promise}
   */
  getAsAdminSettingValues: function (includeAdminPort) {
    return getAsAdminSettingValues_(includeAdminPort);
  },

  /**
   * Returns the setting value for Maven. The promise resolve parameter is from type MavenSetting.
   *
   * @return {Q.promise}
   */
  getMavenSettingValues: function () {
    return getMavenSettingValues_();
  },

  /**
   * Try to find the command in the `PATH` environment. In case of success the promise resolve parameter has the
   * full filename to the command. In case of error the promise reject parameter returns a ErrorMessage.
   *
   * ```js
   * runner.findCommand('mvn').then(
   *   function (cmdPathname) {
   *     console.log('Full Path to "mvn" is "%s"', cmdPathname);
    *  },
   *   function (reason) {
   *     console.error(reason.message);
   *   }
   * );
   * ```
   *
   * @param {string} cmd the command
   * @return {Q.promise}
   */
  findCommand: function (cmd) {
    return findCmd_(cmd);
  },

  /**
   * Returns the map with the environment variables (with the inherited variables)
   * @return {Map<string, string>} the map with the key value entries
   */
  getEnvironment: function () {
    return getEnvironment_();
  }
};

function getAsAdminCommand_() {
  var serverHome = configure.get('server.home', null);
  var command = configure.get('command.asadmin', null, true);
  if (!utilities.isDefined(serverHome) || !command) {
    return null;
  }
  return configure.adjustValue(command);
}

/**
 * @name ExecuteMessage
 * @description The message execution.
 * @property {number} duration
 * @property {number} exitCode
 */

/**
 * @return {Q.promise}
 * @private
 */
function execute_(cmd, args, env) {
  var done = Q.defer();
  var startTime = Date.now();
  var options = {
    cwd: process.cwd()
  };
  if (env) {
    options.env = env;
  }
  if (process.platform === 'win32') {
    logger.info('run on windows');
    args.unshift('/c', cmd);
    cmd = 'cmd.exe';
  }
  var waitingTimeout = configure.get('command.timeout', DEFAULT_WAITING);
  var timeout = null; // timeout object
  var command = spawn(cmd, args, options);

  command.stdout.on('data', function (data) {
    if (data instanceof Buffer) {
      data = data.toString();
    }
    var msgList = data ? data.split('\n') : [];
    _.forEach(msgList, function (msg) {
      if (_.size(msg) > 0) {
        logger.info(' > %s', msg.replace('\t', '    '));
      }
    });
  });
  command.stderr.on('data', function (data) {
    if (data instanceof Buffer) {
      data = data.toString();
    }
    var msgList = data ? data.split('\n') : [];
    _.forEach(msgList, function (msg) {
      if (_.size(msg) > 0) {
        logger.error(' > %s', msg.replace('\t', '   '));
      }
    });
  });
  command.on('close', function (code) {
    if (timeout) {
      var t = timeout;
      timeout = null;
      clearTimeout(t);
    }

    var endTime = Date.now() - startTime;
    if (code === 0) {
      logger.info('Finish');
      logger.info();
      done.resolve({
        duration: endTime,
        exitCode: 0
      });
    } else {
      logger.error('Finish with error (%s)', code);
      logger.error();
      var err = utilities.error(null, 'Finish with error (exist code %s)', code);
      err.duration = endTime;
      err.exitCode = code;
      done.resolve(err);
    }

  });
  command.on('error', function (err) {
    logger.error('Error Occurred!');
    var endTime = Date.now() - startTime;
    var error = utilities.error(err, 'Error occurred');
    error.duration = endTime;
    done.reject(error);
  });

  if (waitingTimeout > 0) {
    timeout = setTimeout(function () {
      command.kill('SIGINT');
      logger.warn('Timeout is reaching!');
      var endTime = Date.now() - startTime;
      var error = utilities.error(null, 'Timeout is reaching. Stop execution!');
      error.duration = endTime;
      done.reject(error);
    }, waitingTimeout);
  }

  return done.promise;
}

/**
 * @name AsAdminSetting
 * @description The object contains the settings for asadmin.
 * @property {string} asadmin the command
 * @property {string} domainHome the home directory of the domains
 * @property {string} domainName the name of the domain
 * @property {number} [portBase] the base port.
 * @property {number} [adminPort] the port number of the admin console.
 */

function getAsAdminSettingValues_(includeAdminPort) {
  return Q.fcall(function () {
    var messages = [];
    var asadmin = path.normalize(getAsAdminCommand_());
    var domainHome = path.normalize(configure.adjustValue(configure.get('domain.home', null)));
    var domainName = configure.get('domain.name', null);
    logger.debug('asadmin: ', asadmin);
    if (!asadmin || _.startsWith(asadmin, '-')) {
      messages.push('The setting "command.asadmin" is required!');
    }
    if (!utilities.isDefined(domainHome)) {
      messages.push('The setting "domain.home" is required!');
    }
    if (!utilities.isDefined(domainName)) {
      messages.push('The setting "domain.name" is required!');
    }
    if (_.size(messages) > 0) {
      return Q.reject(utilities.error(null, messages.join('\n')));
    }
    /** @type {AsAdminSetting} */
    var values = {
      asadmin: asadmin,
      domainHome: domainHome,
      domainName: domainName
    };
    if (includeAdminPort === true) {
      var portBase = configure.get('domain.ports.base', 8000);
      var adminPort = configure.get('domain.ports.admin', -1);
      if (adminPort <= 0) {
        adminPort = portBase + 48;
      }
      values.portBase = portBase;
      values.adminPort = adminPort;
    }
    return Q.resolve(values);
  });
}

/**
 * @name MavenSetting
 * @property {string} maven
 * @property {string} project
 * @property {string} setting
 */

/**
 * @return {Q.promise}
 * @private
 */
function getMavenSettingValues_() {
  return Q.fcall(function () {
    var messages = [];
    var mavenHome = path.normalize(configure.adjustValue(configure.get('maven.home', null)));
    var mavenProject = path.normalize(configure.adjustValue(configure.get('maven.project', 'pom.xml')));
    var mavenSettingFile = path.normalize(configure.adjustValue(configure.get('maven.setting', null)));
    if (!utilities.isDefined(mavenHome)) {
      messages.push('The setting "maven.home" is required!');
    }
    if (!utilities.isDefined(mavenProject)) {
      messages.push('The setting "maven.project" is required');
    }
    if (_.size(messages) > 0) {
      return Q.reject(utilities.error(null, messages.join('\n')));
    }
    var mvnCmd = process.platform === 'win32' ? 'mvn.cmd' : 'mvn';
    /** @type {MavenSetting} */
    var mavenSetting = {
      maven: path.join(mavenHome, 'bin', mvnCmd),
      project: mavenProject,
      setting: mavenSettingFile ? (mavenSettingFile !== '-' ? mavenSettingFile : null) : null
    };
    if (settings.isVerbose()) {
      logger.debug('maven settings: ', JSON.stringify(mavenSetting));
    }
    return Q.resolve(mavenSetting);
  });
}

function findCmd_(cmd) {
  var done = Q.defer();
  var commandPattern = (process.platform === 'win32') ? 'where %s' : 'which %s';
  var options = {
    timeout: 30000
  };
  var command = util.format(commandPattern, cmd);
  var result = {};

  var child = exec(command, options, function (err, stdout, stderr) {
    if (err) {
      var msg = err.message || '-';
      logger.warn('Err has occurred (command %s): %s', cmd, msg.trim());
      return done.resolve(result);
    }
    if (stdout instanceof Buffer) {
      stdout = stdout.toString();
    }
    if (stderr instanceof Buffer) {
      stderr = stderr.toString();
    }

    if (_.size(stderr) > 0) {
      logger.error(stderr.trim());
      return done.resolve(result);
    }
    if (_.size(stdout) === 0) {
      return done.done.resolve();
    }
    result[cmd] = stdout.trim();
    done.resolve(result);
  });

  logger.debug('Try to find command "%s" (pid=%s)...', cmd, child.pid);

  return done.promise;
}

function getEnvironment_() {
  var env = configure.get('env', null);
  var resultEnv = {};

  logger.info('Environment:');

  // add the process environment
  _.forEach(process.env, function (value, name) {
    resultEnv[name] = value;
    if (settings.isVerbose()) {
      logger.info(' -> %s = %s', name, value);
    }
  });

  if (env) {
    // append the environment from the configuration
    _.forEach(env, function (value, name) {
      var adjustedValue = configure.adjustValue(value);
      resultEnv[name] = adjustedValue;
      logger.info(' -> %s = %s', name, adjustedValue);
    });
  }

  logger.info('');

  return resultEnv;
}
