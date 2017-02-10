title: Heringsfish - Plugin "Start Derby Database"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Start Derby Database"

> This section describes the help for the plugin **Start Derby Database**.<br>
> **Note**: This is only for the builtin Derby database server!


## Description

Starts the builtin Derby database on the application server.

The builtin Derby database is not automatic starts when the server is
starting.

This action is only for the Derby database.


## Usage

```bash
$ hf start-derby [--home=path/to/database/home [--host=domain [--port=port]]]
```

## Additional Arguments

* `--home=database/home`<br>
  the database home directory for embedded database server.<br>
  **Note** It is allow to set property keys in the path name (e.g `--home={project.home}/database`)
* `--host=domain`<br>
  the domain name of the external database server. Default is `localhost`.
* `--port=port`<br>
  the port number of the external database server. Default port is `1527.

## Example

```bash
$ hf start-domain -v --home={user.home}/var/database
$ hf start-domain -v --home={project.home}/database
$ hf start-domain --host=localhost --port=1527
```

## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings