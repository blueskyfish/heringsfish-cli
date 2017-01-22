title: Heringsfish - Plugin "Init"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin Init

> This section describes the plugin **init**.

## Description

Initial the `Heringsfish` server config in the current project. 

The file name of the server configuration is "server-config.json". It is a
simple JSON object. The file can be edited directly with a simple text editor.

If the environment **PATH** contains the applications *AsAdmin*, *Maven*
and *Ant*, then they are integrated.

If a command in the platforms is different, then the property command can
record this for the respective platform.

**Example**

```json
{
  "command": {
    "asadmin": {
      "win32": "{server.home}/bin/asadmin.bat",
      "unix": "{server.home}/bin/asadmin"
    }
  }
}
```

* The command extension **win32** is for the platform Windows
* The command extension **unix** is for macOS / Linux.


## Usage:

```bash
$ hf init [-f | --force]
```

## Additional Arguments:

* `-f | --force` (optional) overrides the existing config setting file.

## Example:

```bash
$ hf init
$ hf init -f
$ hf init -vf
```

## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
