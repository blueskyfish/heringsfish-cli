
![Logo](logo.png)

# Heringsfish Command Line Interface (cli)

> Command Line Interface to admin the Glassfish / Payara Application Server


## Content

* [Overview](#user-content-overview)
* [Requirement](#user-content-requirement)
* [Installation](#user-content-installation)
* [Quick Startup](#user-content-quick-startup)
* [Introduction of Action](#user-content-introduction-of-action)
* [List of Action](#user-content-list-of-content)
* [History](#user-content-history)
* [License](#user-content-license)
* [Third Party](#user-content-third-party)


## Overview

The CLI allows you to a GlassFish or Payara Application Server easy to use and a encapsulated development environment for your JEE set 7 project.


## Requirement

The following programs or modules are necessary:

* [Node JS](https://nodejs.org/): This cli is tested with the version 0.12.x
* Application Server [Glassfish 4.1](https://glassfish.java.net/) or [Payara 4.1](http://www.payara.fish/): Just install the server somewhere on your computer.
* [Maven](https://maven.apache.org/): The command `mvn` should in your `PATH` or setup in the configuration
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


## Introduction of Action


### Debugging

It is possible to get more output on the console. Add simple the argument -d on the end of your command.

```sh
$ hf init
$ hf init --verbose
```


### Call action

If the program name the first argument does not begin with the characters x, then is evaluated as the action. It is also possible to define with the argument -a action an action name.

**Example**

```sh
$ hf version -v
$ hf -v -a version
```

### Get Help

```sh
$ hf help action
```

## Configure

```json
{
    "name": "-",
    "version": "0.0.1",
    "server": {
        "home": "-"
    },
    "maven": {
        "home": "-"
    },
    "domain": {
        "name": "-",
        "home": "{project.home}/domains",
        "deploy": {
        },
        "ports": {
            "base": 30000
        }
    }
}
```

## History

| Version    | Date       | Description
|------------|------------|-----------------------------------------
| 0.0.1      | 2016-01-11 | Initial commit (all started here)


## License

```
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
