/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 */

'use strict';

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'init',
  description: 'registers a JDBC connection pool on the Glassfish / Payara'
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
  // Get Settings
  // Prepare Settings

  // Execute the command
  // Help?
  // Command: $ asadmin create-jdbc-connection-pool --help
}