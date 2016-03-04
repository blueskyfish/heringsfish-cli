
![Logo](logo.png)

# Heringsfish Command Line Interface (cli)

> Command Line Interface to manages the [Glassfish][glassfish] / [Payara][payara] Application Server and the maven deployment on local machine


## Table of Content

* [Overview](#user-content-overview)
* [Requirement](#user-content-requirement)
* [Installation](#user-content-installation)
* [Find Help](#user-content-find-help)
* [Quick Startup](#user-content-quick-startup)
* [Configure](#user-content-configure)
    * [Example of Configure](#user-content-example-of-configure)
    * [List of Action](#user-content-list-of-action)
    * [Replaced Variables](#user-content-replaced-variables)
    * [Environment Variables](#user-content-environment-variables)
* [Road Map](#user-content-road-map)
* [History](#user-content-history)
* [License](#user-content-license)
* [Third Party](#user-content-third-party)


## Overview

The CLI allows you to a [GlassFish][glassfish] or [Payara][payara] Application Server easy to use and a encapsulated development environment for your JEE set 7 project.


## Requirement

The following programs or modules are necessary:

* [Node JS][nodejs]: This cli is tested with the version 0.12.x
* Application Server [Glassfish 4.1][glassfish] or [Payara 4.1][payara]: Just install the server somewhere on your computer.
* [Maven][maven]: The command `mvn` should in your `PATH` or setup in the configuration
* An Java IDE :-)


## Installation

Global install:

```sh
$ npm install -g heringsfish-cli
```

Github

```sh
$ cd /path/to/your/projects
$ git clone https://github.com/blueskyfish/heringsfish-cli.git
$ cd heringsfish-cli
$ npm install
$ npm test
$ npm link
```

**Note**: the command `npm link` creates an short link to the program. Now your are able to type in your
console window `hf ...`. May you need to call `sudo npm link`.


## Find Help

Every action has a help or explanation page.

The command `hf help [action]` shows the help or explanation page. The help command shows all possible actions, when omitted the action parameter.

```sh
$ hf help
$ hf help init
$ hf help build
```



## Quick Startup

```sh
( 1) $ cd /your/project
( 2) $ hf init
( 3) $ hf config name "Your Project"
( 4) $ hf config server.home /path/to/application/server
( 5) $ hf config domain.home /path/to/domains
( 6) $ hf config domain.name your-project
( 7) $ hf config domain.ports.base 30000
( 8) $ hf config domain.deploy.nameOfWarApp "{project.home}/target/your-project.war
( 9) $ hf create
(10) $ hf start
(11) $ hf deploy
(12) $ open "http://localhost:30048/
(13) $ open "http://localhost:30080/your-project
(14) $ hf undeploy
(15) $ hf stop
(16) $ hf remove
```

1. Change into your project
2. Initialize the configuration for your project.
3. Set your project name
4. Set the home of the application
5. Set the domain home path
6. Set the domain name (without a whitespace)
7. Set the base port (all other ports are calculated from this port)
8. Set the file deploying on the application server
9. Set create the domain
10. Start the application server
11. Start the deployment
12. Open the Admin Console of the application server
13. Open your deployed web/rest (etc) application
14. Undeploy the deployed application
15. Stop the application server
16. Remove and delete the domain.


## Configure

The configure settings are in the file `server-config.json`. This file is in the project root directory and has format `JSON`.

There are 2 ways to edit the configuration:

* call the cli with the action `config`<br>
  example: `$ hf config server.home "{project.home}/tools/glassfish4"`
* edit the file `server-config.json` directly.<br>
  example: `$ nano server-config.json`

### Example of Configure

```json
{
    "name": "test-project",
    "version": "0.1.0-SNAPSHOT",
    "server": {
        "home": "{user.home}/bin/payara-4.1.1.154"
    },
    "maven": {
        "home": "{user.home}/bin/maven-3.3.4",
        "setting": "{project.home}/setting.xml",
        "project": "{project.home}/projects/pom.xml"
    },
    "domain": {
        "name": "test-project",
        "home": "{project.home}/domains",
        "deploy": {
            "rest-provider": "{project.home}/projects/rest-provider/target/rest-provider-0.1.0-SNAPSHOT.war",
            "business-beans": "{project.home}/projects/business-beans/target/business-beans-0.1.0-SNAPSHOT.jar"
        },
        "ports": {
            "base": 50000
        }
    },
    "env": {
        "project.home": "{project.home}",
        "user.home": "{user.home}",
        "project.name": "{project.name}",
        "project.version": "{project.version}",
        ...
    }
}
```


### List of Action

Aktion      | Optional additional Arguments  | Description
------------|--------------------------------|------------------------------------------------------------
`init`      | -                              | Create the config settings in the current project folder.
`config`    |                                | Set a configuration setting.
            | `key value`                    | the key and its value. It can be more then a key value pair.
            | `-l | --list`                  | Show the current configuration.
            | `key --delete`                 | Delete a configuration setting.
`create`    | -                              | Creates the domain on the application server.
`start`     | -                              | Starts the application server with the domain.
`restart`   |                                | Stops and starts the application server with the domain.
            | `-k | --kill`                  | Specifies whether the domain is killed by using functionality of the operating system to terminate the domain process.
`deploy`    |                                | Build the application with maven.
            | `application`                  | the name of the deploying application. If no application is specified, all Applications are deployed.
            | `--nobuild`                    | Disable the maven build process before deploying.
            | `--skip`                       | Skip to execute the test cases.
            | `-c | --clean`                 | Add the clean goal to the maven build process.
            | `-p profiles`                  | Add the maven profile(s)
            | `--profile=profiles`           | Add the maven profile(s)
`list`      |                                | Display either the domains of the application server or the list of deployed application on the server.
            | `--app`                        | Display the deployed application on the application server.
            | `-d | --domain`                | Display the domains of the application server.
`undeploy`  |                                | Undeploy and remove the application from the application server.
            | `application`                  | the name of the deploying application. If no application is specified, all Applications are undeployed.
`redeploy`  |                                | Unfortunately it is not implemented yet. Instead use the action `stop` and then `start`.
`stop`      |                                | Stops the application server with the domain.
            | `-k | --kill`                  | Specifies whether the domain is killed by using functionality of the operating system to terminate the domain process.
`remove`    | -                              | Remove and delete the domain on the application server.


### Replaced Variables

Certain variables can be replaced. The Application Server is included in the project. By means of the variable project.home the directory of the project can be used.

For Example:
```
{
  "server": {
    "name": "${project.home}/tools/payara-4.1.1.154"
  }
}
```

| Name              | Value or description
|-------------------|-----------------------------------
| `project.home`    | The directory of the project
| `user.home`       | The user home directory
| `domain.name`     | The name of the domain
| `domain.home`     | The domain home directory
| `version`         | The project version
| `project.version` | The project version
| `name`            | The project name
| `project.name`    | The project name


### Environment Variables

It is possible to define environment variables in the section `env`, which are also transferred when the application server starts.

See example above.



## Road Map

* Extends and defines project plugins. Every project should have own plugins.
* Handle [Wildfly Server](http://wildfly.org/)
* Handle with DataSources
* Gulp Plugin


## History

| Version    | Date       | Description
|------------|------------|-----------------------------------------
| 0.5.3      | 2016-03-04 | show environments, some fixes.
| 0.5.2      | 2016-02-24 | add the environments without modify the name.
| 0.4.0      | 2016-02-11 | Update node module "lodash"
| 0.3.0      | 2016-02-11 | add the missing actions "restart" and "redeploy"
| 0.2.2      | 2016-02-10 | Improve conversion rules for environment name.
| 0.2.1      | 2016-02-10 | Environment variables for executing the application server.
| 0.1.1      | 2016-02-09 | show the current directory
| 0.1.0      | 2016-02-09 | add setting.xml for maven
| 0.0.3      | 2016-02-01 | fixed the server base port
| 0.0.2      |            | Improve documentation
| 0.0.1      | 2016-01-11 | Initial commit (all started here)


## License

```
The MIT License (MIT)

Copyright (c) 2016 BlueSkyFish

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```


## Third Party

All company, brand and product names are trademarks of their respective owners.

[glassfish]: https://glassfish.java.net/
[payara]: http://www.payara.fish/
[nodejs]: https://nodejs.org/
[maven]: https://maven.apache.org/