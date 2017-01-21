
# Plugin Init

> Initial the `Heringsfish` server config in the current project.

## Description

Initial the `Heringsfish` server config in the current project. 

The file name of the server configuration is "server-config.json". It is a
simple JSON object.

The file can also be edited directly with a simple text editor.

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
