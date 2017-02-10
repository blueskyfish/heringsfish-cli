title: Heringsfish - Plugin Configuration
---

# Plugin Configuration

> This sections describes the settings and / or configuration of plugins.

## Overview

A plugin must be configured before using it. The configuration of plugin is contained
the file `server-config.json` under the section `plugins`.

The section `plugins` is a map (dictionary) with an unique key (the action name) and
an object with some property elements.

**Example in `server-config.json`**

```json
{
  "plugins": {
    "help": {
      "name": "help",
      "description": "a short description",
      "path": "hf/plugins/plugin-help.js",
      "help": "hf/help/plugin-help.txt",
      "settings": { }
    }
  }
}
```

## Plugin Config

The type `PluginConfig` is described a plugin configuration.

| Property             | Type          | Required   | Description
|----------------------|---------------|:----------:|-------------------------------------
| `name`               | String        | yes        | The plugin name
| `description`        | String        | no         | The optional short description of the plugin
| `path`               | String        | yes        | The path to the javascript module that is the plugin.
| `help`               | String        | no         | The path to a the help text file.
| `settings`           | Object        | no         | Internal configuration.


## Builtin Plugins

Many plugins are built in. This plugins are able to override in the `server-config.json` in your project.

A list of all builtin plugins are described on the [Plugin Overview](plugins/plugins.html)

## How override Builtin Plugin

The file `server-config.json` contains the section `plugins`. Add a plugin with the same action name as the
builtin plugins and an different type of `PluginConfig`.

**Example**

You want to override the builtin plugin `init`:

```json
{

  "plugins": {
    "init": {
      "name": "my-init",
      "description": "My initialize function",
      "path": "path/to/your/my-init-plugin.js",
      "help": "path/to/your/help/my-init-plugin.txt"
    }
  }
}
```
