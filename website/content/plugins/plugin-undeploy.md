title: Heringsfish - Plugin "Undeploy"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Undeploy"

> This section describes the help for plugin `undeploy`.

## Description:

Undeploy and remove application(s) from the application server.

## Requirement

| Property                  | Description
|---------------------------|------------------------------------------------
| `server.home`             | The path to the application server
| `domain.name`             | The name of the domain
| `domain.home`             | The path to the domain directory.


## Usage

```bash
$ hf undeploy [application]
```


## Additional Arguments:

* `application`<br>
   (optional) the name of the deploying application. If no application is specified, all Applications are undeployed.


## Example

```bash
$ hf undeploy
$ hf undeploy "test-application" -v
$ hf undeploy --quiet
```


## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
