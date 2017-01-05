/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const path = require('path');

const Q = require('q');

const configure = require('lib/configure');
const logger    = require('lib/logger');
const settings  = require('lib/settings');

const builder   = require('lib/core/builder');
const ioThen    = require('lib/core/io-then');

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'config',
  description: 'Read and write the configuration'
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
  return Q.fcall(function () {
    var startTime = Date.now();

    logger.info('Execute "%s" (%s)', mInfo.action, mInfo.description);

    return _existConfigSettings()
      .then(function () {
        if (settings.getListParameterSize() > 0) {
          if (settings.getSetting('delete', false)) {
            return _deleteConfigSettings(startTime);
          }
          return _updateConfigSettings(startTime);
        }
        return _displayConfigSettings(startTime);
      });
  });
}

function _existConfigSettings() {
  var filename = configure.getFilename();
  return ioThen.exists(filename).then(
    function (fileExists) {
      if (!fileExists) {
        return Q.reject(
          builder.createError(null,
            'Configuration file "%s" is missing in the project directory "%s"',
            builder.shortPathName(configure.getFilename()),
            builder.getProjectPathName()
          )
        );
      }
      return Q.resolve();
    }
  )
}

function _mayDisplayConfigure() {
  logger.info();
  if (settings.isSetting('l', 'list')) {
    configure.print();
  }
}

function _updateConfigSettings(startTime) {
  var addItems = 0;
  var index = 0;
  var name = settings.getSetting(index++, null);
  var value = settings.getSetting(index++, null);
  logger.info();
  logger.info('Update the configuration settings:');
  while (name && value) {
    configure.save(name, value);
    logger.info('  update %s => %s', name, value);
    addItems++;
    name = settings.getSetting(index++, null);
    value = settings.getSetting(index++, null);
  }
  _mayDisplayConfigure();

  var bean = {
    duration: (Date.now() - startTime)
  };
  return Q.resolve(builder.createSuccess(bean, 'Update %s item%s successful', addItems, (addItems > 0 ? 's' : '')));
}

function _deleteConfigSettings(startTime) {
  var deleteItem = 0;
  var index = 0;
  var name = settings.getSetting(index++, null);
  logger.info();
  logger.info('Delete some keys from configuration settings:');
  while (name) {
    configure.delete(name);
    logger.info('  delete %s', name);
    deleteItem++;
    name = settings.getSetting(index++, null);
  }
  _mayDisplayConfigure();

  var bean = {
    duration: (Date.now() - startTime)
  };
  return Q.resolve(builder.createSuccess(bean, 'Delete %s item%s successful', deleteItem, (deleteItem > 0 ? 's' : '')));
}

function _displayConfigSettings(startTime) {

  _mayDisplayConfigure();

  var bean = {
    duration: (Date.now() - startTime)
  };
  return Q.resolve(builder.createSuccess(bean, 'Finish'));
}
