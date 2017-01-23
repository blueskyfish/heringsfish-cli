title: Heringsfish - Plugin "Stop Server"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Stop Server"

> This section describes the stoping of the application server with the domain.

## Description

Stops the application server with the domain. Stops the server directly with
the additional parameter `-k` or `--kill`.

## Requirement in the config file

| Property                  | Description
|---------------------------|------------------------------------------------
| `server.home`             | The path to the application server
| `domain.name`             | The name of the domain
| `domain.home`             | The path to the domain directory.


## Usage

```bash
$ hf stop-server
```


## Additional Arguments

* `-k | --kill`<br>
  (**optional**) Specifies whether the domain is killed by using functionality
   of the operating system to terminate the domain process.


## Example

```bash
$ hf stop-server
$ hf stop-server --kill
$ hf stop-server -vk
$ hf stop-server --quiet
```


## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
