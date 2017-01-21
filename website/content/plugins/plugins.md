title: Heringsfish - Plugin Overview
---

# Plugin Overview

A plugin is a javascript module and executes an action. The name of the plugin is the name of the action too.

## Builtin Plugins

| Action        | Plugin       | Description
|---------------|:------------:|------------------------------------
| `help`        | **help**     | Shows the help to the action / plugin
| `init`        | **init**     | Initial the `Heringsfish` server config in the current project.



## Create an own Plugin

This section describes how to build your own plugin for `heringsfish`.

* Defines a javascript node module.
* The module exports only one function that receive one parameter from type `Options`.

**Example**

```js
/*!
 * Your module
 */

/**
 * This is the only function of the module exports
 * 
 * @param {Options} options contains some functionality of the heringsfish
 * @return {Promise<*>}
 */
module.exports = function (options) {
  return new Promise(function(resolve, reject) {

    // reject({
    //   code: 0xffffff,
    //   message: 'Error',
    // });
    resolve({
      message: 'Success'
    });
  });
}
```
