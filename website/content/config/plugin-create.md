title: Heringsfish - Create Plugin Programmatically
---

# Create Plugin Programmatically

This section describes how to build your own plugin for `heringsfish`.

* Defines a javascript node module.
* The module exports only one function that receive one parameter from type `Options`.
* Configure in the `server-config.json`.

## JavaScript Module

The javascript module shows a skeleton of the plugin. The module returns only one
function with one parameter from type [Options](api/class-options.html) and returns
an Promise instance.

If an error occurs while working, the reject function must be called, otherwise
it should resolve the function.

```js
/*!
 * Your module
 */

/**
 * This is the only function that is exported.
 * 
 * @param {Options} options contains some functionality of the heringsfish
 * @return {Promise<*>}
 */
module.exports = function (options) {
  return new Promise(function(resolve, reject) {
    const settings = options.getCurrentPlugin().getSettings();

    const message = settings.message;
    if (!message) {
      return reject({
        code: 0xffffff,
        message: 'Missing setting.message',
      });  
    }
    
    options.logInfo('>>> %s', settings.message || '??');
    resolve({
      message: 'Success'
    });
  });
}
```

## Configure in `server-config.json`

```json
{
  "plugins": {
    "my-plugin": {
      "name": "my-first-plugin",
      "description": "this is my first plugin",
      "path": "tools/plugins/my-first-plugin.js",
      "help": "tools/help/my-first-plugin.txt",
      "settings": {
        "message": "Hello from my Plugin"
      }
    }
  }
}
```

## Call Your Plugin

**Execution**

```bash
$ hf my-pugin -v
```

**Help**

```bash
$ hf help my-plugin
```
