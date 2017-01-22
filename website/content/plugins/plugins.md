title: Heringsfish - Plugin Overview
---

<span class="fa fa-plug fa-4x"></span>

# Plugin Overview

A plugin is a javascript module and executes an action. The name of the plugin is the name of the action too.

## Builtin Plugins

| Plugin                                                                 | Action      | Description
|------------------------------------------------------------------------|:-----------:|------------------------------------
| [<span class="fa fa-plug"></span> Help](plugins/plugin-help.html)      | `help`      | Shows the help to the action / plugin
| [<span class="fa fa-plug"></span> Init](plugins/plugin-init.html)      | `init`      | Initial the `Heringsfish` server config in the current project.
| [<span class="fa fa-plug"></span> Create Domain](plugins/plugin-create-domain.html) | `create-domain` | Creates the domain on the application server.
| [<span class="fa fa-plug"></span> Remove Domain](plugins/plugin-remove-domain.html) | `remove-domain` | Remove and delete the domain on the application server.


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
