/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const childProcess = require('child_process');
const path = require('path');
const util = require('util');

const _ = require('lodash');
const Q = require('q');

const config    = require('lib/config');
const defines   = require('lib/defines');
const logger    = require('lib/logger');
const builder   = require('lib/core/builder');
const json      = require('lib/core/json');

// TODO: remove
const asadmin   = require('lib/server/asadmin');

const spawn = childProcess.spawn;
const exec = childProcess.exec;

const DEFAULT_WAITING = 1200000; // 10 minutes

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
   * @return {promise}
   */
  execute: function (cmd, args, env) {
    return execute_(cmd, args, env);
  },

  /**
   * Returns the setting values for ASADMIN. In case of success the promise then part call a
   * function AsAdminSetting parameter.
   *
   * @param {boolean} [includeAdminPort]
   * @return {promise}
   */
  getAsAdminSettingValues: function (includeAdminPort) {
    logger.warn('Deprecated: use instead asadmin.getAsAdminSettingValues()');
    return asadmin.getAsAdminSettingValues(includeAdminPort);
  },

  /**
   * Returns the setting value for Maven. The promise resolve parameter is from type MavenSetting.
   *
   * @return {promise}
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
   * @return {promise}
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
  var serverHome = config.getConfig('server.home', null);
  var command = config.getConfig('command.asadmin', null, true);
  if (!builder.isDefined(serverHome) || !command) {
    return null;
  }
  return config.parseValue(command);
}

/**
 * @name ExecuteMessage
 * @description The message execution.
 * @property {number} duration
 * @property {number} exitCode
 */

/**
 * @return {promise}
 * @private
 */
function execute_(cmd, args, env) {
  var done = Q.defer();
  var startTime = Date.now();
  var options = {
    cwd: defines.PROJECT_HOME
  };
  if (env) {
    options.env = env;
  }
  if (defines.IS_WIN) {
    logger.info('run on windows');
    args.unshift('/c', cmd);
    cmd = 'cmd.exe';
  }
  var waitingTimeout = config.getConfig('command.timeout', DEFAULT_WAITING);
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
      var err = builder.createError(null, 'Finish with error (exist code %s)', code);
      err.duration = endTime;
      err.exitCode = code;
      done.resolve(err);
    }

  });
  command.on('error', function (err) {
    logger.error('Error Occurred!');
    var endTime = Date.now() - startTime;
    var error = builder.createError(err, 'Error occurred');
    error.duration = endTime;
    done.reject(error);
  });

  if (waitingTimeout > 0) {
    timeout = setTimeout(function () {
      command.kill('SIGINT');
      logger.warn('Timeout is reaching!');
      var endTime = Date.now() - startTime;
      var error = builder.createError(null, 'Timeout is reaching. Stop execution!');
      error.duration = endTime;
      done.reject(error);
    }, waitingTimeout);
  }

  return done.promise;
}

/**
 * @name MavenSetting
 * @property {string} maven
 * @property {string} project
 * @property {string} setting
 */

/**
 * @return {promise}
 * @private
 */
function getMavenSettingValues_() {
  return Q.fcall(function () {
    var messages = [];
    var mavenHome = path.normalize(config.parseValue(config.getConfig('maven.home', null)));
    var mavenProject = path.normalize(config.parseValue(config.getConfig('maven.project', 'pom.xml')));
    var mavenSettingFile = path.normalize(config.parseValue(config.getConfig('maven.setting', null)));
    if (!builder.isDefined(mavenHome)) {
      messages.push('The setting "maven.home" is required!');
    }
    if (!builder.isDefined(mavenProject)) {
      messages.push('The setting "maven.project" is required');
    }
    if (_.size(messages) > 0) {
      return Q.reject(builder.createError(null, messages.join('\n')));
    }
    var mvnCmd = defines.IS_WIN ? 'mvn.cmd' : 'mvn';
    /** @type {MavenSetting} */
    var mavenSetting = {
      maven: path.join(mavenHome, 'bin', mvnCmd),
      project: mavenProject,
      setting: mavenSettingFile ? (mavenSettingFile !== '-' ? mavenSettingFile : null) : null
    };
    if (config.isVerbose()) {
      logger.debug('maven settings: ', json.stringify(mavenSetting));
    }
    return Q.resolve(mavenSetting);
  });
}

function findCmd_(cmd) {
  var done = Q.defer();
  var commandPattern = defines.IS_WIN ? 'where %s' : 'which %s';
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
  var env = config.getConfig('env', null);
  var resultEnv = {};

  logger.info('Environment:');

  // add the process environment
  _.forEach(process.env, function (value, name) {
    resultEnv[name] = value;
    if (config.isVerbose()) {
      logger.info(' -> %s = %s', name, value);
    }
  });

  if (env) {
    // append the environment from the configuration
    _.forEach(env, function (value, name) {
      var adjustedValue = config.parseValue(value);
      resultEnv[name] = adjustedValue;
      logger.info(' -> %s = %s', name, adjustedValue);
    });
  }

  logger.info('');

  return resultEnv;
}
