title: Heringsfish - Plugin "Stop Database"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Start Database"

> This section describes the help for the plugin **Stop Database**.<br>
> **Note**: This is only for the builtin Derby database server!


## Description

Stops the builtin Derby database on the application server.

The builtin Derby database is not automatic stops when the server is
shutdown.

This action is only for the Derby database.


## Usage

```bash
$ hf stop-database [--host=domain [--port=port]]]
```

## Additional Arguments

* `--host=domain`<br>
  the domain name of the external database server. Default is `localhost`.
* `--port=port`<br>
  the port number of the external database server. Default port is `1527.

## Example

```bash
$ hf stop-domain --host=localhost --port=1527
```

## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
