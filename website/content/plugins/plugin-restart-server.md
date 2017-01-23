title: Heringsfish - Plugin "Restart Server"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Restart Server"

> This section describes the stopping and starting of the application server
> with the domain.

## Description

Stops and starts the application server with the domain. Stops the server
directly with the additional parameter `-k` or `--kill`.

## Requirement in the config file

| Property                  | Description
|---------------------------|------------------------------------------------
| `server.home`             | The path to the application server
| `domain.name`             | The name of the domain
| `domain.home`             | The path to the domain directory.


## Usage

```bash
$ hf restart-server
```


## Additional Arguments

* `-k | --kill`<br>
  (**optional**) Specifies whether the domain is killed by using functionality
   of the operating system to terminate the domain process.

## See also

* [Stop Server](plugins/plugin-stop-server.html)
* [Start Server](plugins/plugin-start-server.html)

## Example

```bash
$ hf restart-server
$ hf restart-server --kill
$ hf restart-server -vk
$ hf restart-server --quiet
```


## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
