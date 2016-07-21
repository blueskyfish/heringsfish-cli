/*
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 BlueSkyFish
 *
 * Purpose:
 * List all jdbc pools and resources from the Glassfish / Payara
 */

'use strict';

/**
 * @type {ActionInfo}
 */
var mInfo = {
  action: 'jdbc > list',
  description: 'List all jdbc pools and resources from the Glassfish / Payara'
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
  // list all
  // Help?
  // Command: $ asadmin create-jdbc-connection-pool --help
}
