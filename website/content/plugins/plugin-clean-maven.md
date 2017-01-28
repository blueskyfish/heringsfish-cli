title: Heringsfish - Plugin "Clean Maven"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Clean Maven"

> This section describes the help for the plugin **Clean Maven**.

## Description

Executes the maven goal **clean** in order to clean the deployment directories.


## Requirement

> The action requires some properties from the `server-config.json`.

| Property                  | Description
|---------------------------|------------------------------------------------
| `maven.home`              | The maven home directory.
| `maven.project`           | The maven project pom.xml


## Usage

```bash
$ hf clean-maven [[-v | --verbose] | [-q | --quit]]
```


## Additional Arguments

*No additional arguments*


## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
