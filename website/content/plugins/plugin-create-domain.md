title: Heringsfish - Plugin "Create Domain"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Create Domain"

> This section describes to create the domain on the application server.

## Description

Creates the domain on the application server. This is the step before it can
be an application on the server deploy.

> <span class="fa fa-info-circle" aria-hidden="true"></span> If the domain already exist, then the execution is canceled.


## Requirement in the config file

| Property                  | Description
|---------------------------|------------------------------------------------
| `server.home`             | The path to the application server
| `domain.name`             | The name of the domain
| `domain.home`             | The path to the domain directory.

## Usage

```bash
$ hf create
```

## Additional Arguments

*No additional arguments*

## Example

```bash
$ hf create
$ hf create -v
$ hf create -q
```

## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
