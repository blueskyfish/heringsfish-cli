title: Heringsfish - Plugin "Remove Domain"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Remove Domain"

> This section describes the remove and delete of the domain.


## Description

Remove and delete the domain on the application server.


## Requirement in the config file

| Property                  | Description
|---------------------------|------------------------------------------------
| `server.home`             | The path to the application server
| `domain.name`             | The name of the domain
| `domain.home`             | The path to the domain directory.


## Usage

```bash
$ hf remove-domain
```

## Additional Arguments

*No additional arguments*


## Example

```bash
$ hf remove
$ hf remove -v
$ hf remove --quiet
```


## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
