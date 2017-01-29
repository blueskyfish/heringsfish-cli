title: Heringsfish - Plugin "Stop Derby Database"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Stop Derby Database"

> This section describes the help for the plugin **Stop Derby Database**.<br>
> **Note**: This is only for the builtin Derby database server!


## Description

Stops the builtin Derby database on the application server.

The builtin Derby database is not automatic stops when the server is
shutdown.

This action is only for the Derby database.


## Usage

```bash
$ hf stop-derby [--host=domain [--port=port]]]
```

## Additional Arguments

* `--host=domain`<br>
  the domain name of the binding the derby database server. Default is `localhost` or `0.0.0.0`.
* `--port=port`<br>
  the port number of the binding the derby database server. Default port is `1527.

## Example

```bash
$ hf stop-derby
$ hf stop-derby --host=localhost --port=1527
```

## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
