/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

'use strict';

const util = require('util');

const _    = require('lodash');

/**
 * @module hf/kernel/registry
 * @description
 */

class Registry {

  constructor(plugins) {
    const that = this;

    that.plugins = {};
    _.forEach(plugins, (plugin, name) => {
      if (!!plugin.name && !!plugin.path || !!plugin.help) {
        that.plugins[name] = new Plugin(plugin);
      }
    });
  }

  size() {
    return _.size(this.plugins);
  }

  /**
   *
   * @param {String} pluginName
   * @return {boolean}
   */
  hasPlugin(pluginName) {
    if (!_.isString(pluginName)) {
      return false;
    }
    return !!this.plugins[pluginName];
  }

  /**
   * Try the get the plugin from the given action name
   *
   * @param {String} pluginName
   * @return {Plugin|null} It returns the plugin object or null if the plugin is not existing.
   */
  getPlugin(pluginName) {
    return this.plugins[pluginName];
  }

  /**
   * Iterates over all Plugins.
   *
   * @param {Function} callback the signature (name, plugin)
   * @return {Registry}
   */
  forEach(callback) {
    if (!_.isFunction(callback)) {
      return this;
    }
    _.forEach(this.plugins, (plugin, name) => {
      callback(name, plugin);
    });
    return this;
  }
}

/**
 * @name PluginConfig
 * @property {String} name
 * @property {String} [description]
 * @property {String} path
 * @property {String} help
 * @property {Object} [settings]
 */

/**
 * @class Plugin
 * @description
 * The class is a wrapper of the plugin configuration and has some functionality.
 */
class Plugin {

  /**
   *
   * @param {PluginConfig} plugin
   * @constructor
   */
  constructor(plugin) {

    /**
     * The name of plugin
     * @type {String}
     */
    this.name = plugin.name;

    /**
     * The description of plugin
     * @type {String}
     */
    this.description = plugin.description || '';

    /**
     * @type {String}
     */
    this.pluginPath = plugin.path;

    /**
     * @type {String}
     */
    this.helpPath = plugin.help;

    /**
     * The settings of the plugin
     *
     * @type {Object}
     */
    this.settings   = plugin.settings || {};
  }

  /**
   *
   * @param {Options} options
   * @return {Promise<Object>}
   */
  execute(options) {
    const that = this;

    // try to load the plugin
    let pluginExecutor = null;
    try {
      pluginExecutor = require(that.pluginPath);
    } catch (e) {
      return Promise.reject({
        code: 0xff0003,
        message: util.format('Plugin "%s" could not load (%s)', that.name, e.message || '...'),
        stack: e.stack || null
      });
    }
    // validate the plugin
    if (!pluginExecutor || !_.isFunction(pluginExecutor)) {
      return Promise.reject({
        code: 0xff0004,
        message: util.format('Plugin "%s" is not valid', that.name)
      });
    }

    options.logInfo('');
    options.logInfo('Execute action "%s" @ "%s"', that.name, that.description);
    options.logInfo('');

    // executes the plugin
    const startTime = Date.now();
    return pluginExecutor(options)
      .then((result) => {
        result.pluginDuration = Date.now() - startTime;
        return result;
      }, (reason) => {
        reason.pluginDuration = Date.now() - startTime;
        return Promise.reject(reason);
      });
  }

  /**
   * Returns the parameter value.
   *
   * @param {String} name the name of the parameter property
   * @param {*} defValue the default value if the parameter is not available
   * @return {*} the value of the parameter property
   */
  getSetting(name, defValue) {
    return _.get(this.settings, name, defValue);
  }

  /**
   * Returns the help path
   * @return {String}
   */
  getHelpPath() {
    return this.helpPath;
  }

  getDescription() {
    return this.description || this.name;
  }

  getName() {
    return this.name;
  }

  toString() {
    return util.format('Plugin: %s, path=%s', this.name, this.pluginPath);
  }
}

/**
 * Creates a new Plugin Registry.
 *
 * @param {Object} plugins a map with plugin information
 * @return {Registry}
 */
module.exports.newRegistry = function (plugins) {
  return new Registry(plugins);
};
