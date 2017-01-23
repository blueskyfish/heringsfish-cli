title: Heringsfish - Plugin "Start Server"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Start Server"

> This section describes the starting of the application server with the domain.


## Requirement in the config file

| Property                  | Description
|---------------------------|------------------------------------------------
| `server.home`             | The path to the application server
| `domain.name`             | The name of the domain
| `domain.home`             | The path to the domain directory.


## Usage

```bash
$ hf start-server
```
## Additional Arguments

*No additional arguments*


## See also

* [Restart Server](plugins/plugin-restart-server.html)
* [Stop Server](plugins/plugin-stop-server.html)


## Example

```bash
$ hf start-server
$ hf start-server -v
$ hf start-server --quiet
```


## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
