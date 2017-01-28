title: Heringsfish - Plugin "Deploy Maven"
---

<span class="fa fa-plug fa-4x"></span>


# Plugin "Deploy Maven"

> This section describes the plugin **Deploy Maven**.

## Description
  Build the application with maven.

## Requirement

| Property                  | Description
|---------------------------|------------------------------------------------
| `maven.home`              | The maven home directory
| `maven.project`           | The maven project pom.xml
| `server.home`             | The path to the application server
| `domain.name`             | The name of the domain
| `domain.home`             | The path to the domain directory.
| `domain.deploy`           | A object with the application name and the filename of the deploying application.<br>It is necessary that at least one application is registered.


## Usage

```bash
$ hf deploy-maven [application] | [--nobuild | [--skip | --notest] | \
    [-c | --clean] | [-p profiles | --profile=profiles]]
```

## Additional Arguments

* `[application]`<br>
  (optional) the name of the deploying application. If no application is specified, all Applications are deployed.
* `--nobuild`<br>
  Disable the maven build process before deploying.
* `--skip` or `--notest`<br>
  Skip to execute the test cases.
* `-c` or `--clean`<br>
  Add the clean goal to the maven build process.
* `-p profiles` or `--profiles=profiles`<br>
  Add the maven profile(s). If multiple profiles are to be used, they must be separated with a comma.

## Example

```bash
$ hf build-maven
$ hf build-maven -c
$ hf build-maven -c -p integration,bigData
$ hf build-maven -c -profiles=integration,bigData
$ hf build-maven -qc
```

## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
