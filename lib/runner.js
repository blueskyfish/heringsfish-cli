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
var execSync = childProcess.execSync;
var exec = childProcess.exec;

var DEFAULT_WAITING = 120000; // 2 minutes

module.exports = {

  /**
   * Executes the command.
   *
   * ```js
   * var runner = require('./runner');
   * runner('ls', '-al')
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
   * @return {Q.promise}
   */
  execute: function (cmd, args) {
    return execute_(cmd, args);
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
  }
};

function getAsAdminCommand_() {
  var serverHome = configure.get('server.home', null);
  if (!utilities.isDefined(serverHome)) {
    return null;
  }
  var command = path.join(serverHome, 'bin', 'asadmin');
  return configure.adjustPath(command);
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
function execute_(cmd, args) {
  var done = Q.defer();
  var startTime = Date.now();
  var options = {
    cwd: process.cwd(),
    env: process.env
  };
  var waitingTimeout = configure.get('command.timeout', DEFAULT_WAITING);
  var timeout = null; // timeout object
  var command = spawn(cmd, args, options);
  // when an error is occurred, then all messages are shown as error!
  var errorOccurred = false;

  command.stdout.on('data', function (data) {
    if (data instanceof Buffer) {
      data = data.toString();
    }
    var msgList = data ? data.split('\n') : [];
    _.forEach(msgList, function (msg) {
      if (_.size(msg) > 0) {
        if (errorOccurred) {
          logger.error(' > %s', msg.replace('\t', '    '));
        } else {
          logger.info(' > %s', msg.replace('\t', '    '));
        }
      }
    });
  });
  command.stderr.on('data', function (data) {
    errorOccurred = true;
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

  timeout = setTimeout(function () {
    command.kill('SIGHUP');
    logger.warn('Timeout is reaching!');
    var endTime = Date.now() - startTime;
    var error = utilities.error(null, 'Timeout is reaching. Stop execution!');
    error.duration = endTime;
    done.reject(error);
  }, waitingTimeout);

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
    var asadmin = getAsAdminCommand_();
    var domainHome = configure.adjustPath(configure.get('domain.home', null));
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
 */

/**
 * @return {Q.promise}
 * @private
 */
function getMavenSettingValues_() {
  return Q.fcall(function () {
    var messages = [];
    var mavenHome = configure.adjustPath(configure.get('maven.home', null));
    var mavenProject = configure.adjustPath(configure.get('maven.project', 'pom.xml'));
    var mavenSetting = configure.adjustPath(configure.get('maven.setting', null));
    if (!utilities.isDefined(mavenHome)) {
      messages.push('The setting "maven.home" is required!');
    }
    if (!utilities.isDefined(mavenProject)) {
      messages.push('The setting "maven.project" is required');
    }
    if (_.size(messages) > 0) {
      return Q.reject(utilities.error(null, messages.join('\n')));
    }
    /** @type {MavenSetting} */
    var mavenSetting = {
      maven: path.join(mavenHome, 'bin', 'mvn'),
      project: mavenProject,
      setting: mavenSetting ? (mavenSetting !== '-' ? mavenSetting : null) : null
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