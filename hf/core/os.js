/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

/**
 * @module hf/core/os
 * @description
 * executes and runs external programs / scripts / applications
 *
 * @requires child_process
 * @requires util
 * @requires lodash
 * @requires module:hf/defines
 */

const child   = require('child_process');
const util    = require('util');

const _       = require('lodash');

const DEFINES = require('hf/defines');

const spawn   = child.spawn;
const exec    = child.exec;

const DEFAULT_WAITING  = 1200000; // 10 minutes
const FIND_CMD_WAITING = 30000;  // 30 seconds

/**
 * @name RunResult
 * @property {String} [message]
 * @property {Number} [duration]
 * @property {Number} [exitCode]
 */

/**
 * Executes and runs external programs and waiting until finish the programs.
 *
 * **Errors**
 *
 * | Error     | Message
 * |-----------|----------------------------
 * | 0xff00c1  | Running has occurred an error [+error.message]
 * | 0xff00c2  | Timeout is reaching. Stop execution!
 *
 * @param {Options} options
 * @param {String} cmd the command
 * @param {Array<String>} params the list of parameters
 * @param {Object} [env] the environment
 * @return {Promise<RunResult>}
 */
module.exports.exec = function (options, cmd, params, env) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    let cmdOptions = {
      cwd: DEFINES.PROJECT_PATH
    };
    let timeout = null; // timeout object


    if (env) {
      cmdOptions.env = env;
    }

    if (DEFINES.IS_WIN) {
      options.logInfo('run on windows');
      params.unshift('/c', cmd);
      cmd = 'cmd.exe';
    }
    const waitingTimeout = options.getConfig('command.timeout', DEFAULT_WAITING);

    const command = spawn(cmd, params, cmdOptions);

    // receive data on standard out ....
    command.stdout.on('data', function (data) {
      if (data instanceof Buffer) {
        data = data.toString();
      }
      const msgList = data ? data.split('\n') : [];
      _.forEach(msgList, function (msg) {
        if (_.size(msg) > 0) {
          options.logInfo(' > %s', msg.replace('\t', '    '));
        }
      });
    });

    // receive data on standard error ...
    command.stderr.on('data', function (data) {
      if (data instanceof Buffer) {
        data = data.toString();
      }
      const msgList = data ? data.split('\n') : [];
      _.forEach(msgList, function (msg) {
        if (_.size(msg) > 0) {
          options.logError(' > %s', msg.replace('\t', '   '));
        }
      });
    });

    // receive "close" and finish the command
    command.on('close', function (code) {

      if (timeout) {
        // stop the timer
        const t = timeout;
        timeout = null;
        clearTimeout(t);
      }

      const endTime = Date.now() - startTime;
      if (code === 0) {
        options.logInfo('Finish');
        options.logInfo('');
        resolve({
          duration: endTime,
          exitCode: 0
        });
      }
      else {
        options.logError('Finish with error (%s)', code);
        options.logError('');
        let errorResult = {
          message: util.format('Finish with error (exist code %s)', code),
          duration: endTime,
          exitCode: code
        };
        resolve(errorResult);
      }
    });

    // receive error ...
    command.on('error', function (err) {
      options.logError('Error Occurred!');
      const duration = Date.now() - startTime;
      const error = {
        code: 0xff00c1,
        message: util.format('Running has occurred an error (%s)', err.message || 'Error'),
        stack: err.stack || '',
        duration: duration
      };
      reject(error);
    });

    if (waitingTimeout > 0) {
      // starts the timeout for the processing the external command
      timeout = setTimeout(function __timeoutReaching() {
        command.kill('SIGINT');
        options.logWarn('Timeout is reaching!');
        const duration = Date.now() - startTime;
        const error = {
          code: 0xff00c2,
          message: 'Timeout is reaching. Stop execution!',
          duration: duration
        };
        reject(error);
      }, waitingTimeout);
    }

  });
};

/**
 * Try to find the complete command path.
 *
 *
 * The promise resolve is a option with the cmd as property and the path to the command.
 *
 * ```js
 * os.findCommand(options, 'mvn')
 *   .then((result) => {
 *     if (result.mvn) {
 *       options.logInfo('Complete path to "mnv" is "%s", result.mvn);
 *     }
 *   });
 * ```
 *
 * @param {Options} options
 * @param {String} cmd
 * @return {Promise<*>}
 */
module.exports.findCommand = function (options, cmd) {
  return new Promise(function _findCommand (resolve, reject) {

    const commandPattern = DEFINES.IS_WIN ? 'where %s' : 'which %s';

    const cmdOptions = {
      timeout: FIND_CMD_WAITING // 30 seconds
    };
    const command = util.format(commandPattern, cmd);

    let result = {};

    result[cmd] = null;

    const child = exec(command, cmdOptions, (err, stdout, stderr) => {
      if (err) {
        options.logDebug('Could not found "%s"', cmd);
        return resolve(result);
      }
      if (stdout instanceof Buffer) {
        stdout = stdout.toString();
      }
      if (stderr instanceof Buffer) {
        stderr = stderr.toString();
      }
      if (_.size(stderr) > 0) {
        options.logError(stderr.trim());
        return resolve(result);
      }
      if (_.size(stdout) === 0) {
        return resolve(result);
      }

      result[cmd] = stdout.trim();
      resolve(result);
    });

    options.logDebug('Looking for command "%s" (pid=%s) ...', cmd, child.pid);
  });
};
