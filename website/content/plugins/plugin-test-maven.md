title: Heringsfish - Plugin "Test Maven"
---

<span class="fa fa-plug fa-4x"></span>

# Plugin "Test Maven"

> This section describes the help for the plugin **Test Maven**.

## Description

Executes the maven **test** goal.


## Requirement

> The action requires some properties from the `server-config.json`.

| Property                  | Description
|---------------------------|------------------------------------------------
| `maven.home`              | The maven home directory.
| `maven.project`           | The maven project pom.xml


## Usage

```bash
$ hf test-maven [-c | --clean] | [-p profiles | --profile=profiles]
```


## Additional Arguments

* `-c | --clean`<br>
  Add the clean goal to the maven build process.
* `-p profiles` or `--profile=profiles`<br>
  Add the maven profile(s). If multiple profiles are to be used, they must be separated with a comma.


## Example

```bash
$ hf test-maven
$ hf test-maven -c
$ hf test-maven -c -p integration,bigData
$ hf test-maven -qc
```


## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
