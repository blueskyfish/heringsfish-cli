/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

var path = require('path');

var Q = require('q');

var configure = require('../configure');
var logger = require('../logger');
var settings = require('../settings');
var utilities = require('../utilities');

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
  return utilities.exists(filename).then(
    function (fileExists) {
      if (!fileExists) {
        return Q.reject(
          utilities.error(null,
            'Configuration file "%s" is missing in the project directory "%s"',
            utilities.shortPathName(configure.getFilename()),
            utilities.getProjectPathName()
          )
        );
      }
      return Q.resolve();
    }
  )
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
  logger.info();
  if (settings.isSetting('l', 'list')) {
    configure.print();
  }

  var bean = {
    duration: (Date.now() - startTime)
  };
  return Q.resolve(utilities.success(bean, 'Update %s item%s successful', addItems, (addItems > 0 ? 's' : '')));
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
  logger.info();
  if (settings.isSetting('l', 'list')) {
    configure.print();
  }

  var bean = {
    duration: (Date.now() - startTime)
  };
  return Q.resolve(utilities.success(bean, 'Delete %s item%s successful', deleteItem, (deleteItem > 0 ? 's' : '')));
}

function _displayConfigSettings(startTime) {
  logger.info();
  if (settings.isSetting('l', 'list')) {
    configure.print();
  }
  var bean = {
    duration: (Date.now() - startTime)
  };
  return Q.resolve(utilities.success(bean, 'Finish'));
}