title: Heringsfish - Plugin "Build Maven"
---

<span class="fa fa-plug fa-4x"></span>


# Plugin "Build Maven"

> This section describes the help for plugin **Build Maven**.

## Description

  Build the application with maven.



## Requirement

> The action requires some properties from the `server-config.json`.

| Property                  | Description
|---------------------------|------------------------------------------------
| `maven.home`              | The maven home directory.
| `maven.project`           | The maven project pom.xml


## Usage

```bash
$ hf build-maven [--skip | --nobuild] | [-c | --clean] | [-p profiles | --profile=profiles]
```

## Additional Arguments

* `--skip | --nobuild`<br>
   Skip to execute the test cases.
* `-c | --clean`<br>
   Add the clean goal to the maven build process.
* `-p profiles` or `--profile=profiles`<br>
   Add the maven profile(s). If multiple profiles are to be used, they must be separated with a comma.

## Example

```bash
$ hf build-maven
$ hf build-maven -c
$ hf build-maven -c -p integration,bigData
$ hf build-maven -qc
$ hf build-maven --notest --profiles=bigData
```

## Note:

* `-v | --verbose`<br>
  display more information.
* `-q | --quiet`<br>
  display only errors or warnings
