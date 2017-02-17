title: Heringsfish Command Line Interface
---

![Logo](assets/logo.png)

# Heringsfish Command Line Interface (cli)

> Command Line Interface to manages the [Glassfish][glassfish] / [Payara][payara] Application Server
> and the deployment on local or server machine.

## Overview

The *Command Line Interface* allows you to a [GlassFish][glassfish] or [Payara][payara] Application Server easy to use and a encapsulated development environment for your JEE 7 project.


## Requirement

The following programs or modules are necessary:

* [Node JS][nodejs]: This cli is tested with the version 6.x or higher
* Set the environment variable `JAVA_HOME` must be set (Java 8).
* Application Server [Glassfish 4.1][glassfish] or [Payara 4.1][payara]: Just install the server somewhere on your computer or in the project.
* [Maven][maven]: When using Maven, Maven should be installed on your computer or in the project.
* [Ant](https://ant.apache.org): **Coming Soon** When using Ant, Ant should be installed on your computer or in the project.
* An Java IDE :-)


## Installation

It is recommended to install `Heringsfish` globally. This makes it possible to execute the `Heringsfish actions directly in each project.`

```bash
$ npm install -g heringsfish-cli
```

## Quick Setup

> [A full setup is described here](config/setup-project.html).

The following instructions shows the basic steps. [You must edit the configuration](config/setup-project.html) between steps 2 and 3.

```sh
( 1) $ cd /your/project
( 2) $ hf init
( 3) $ hf create-domain
( 4) $ hf start-server
( 5) $ hf jdbc create --name testDB
( 6) $ hf deploy-maven
( 7) $ open "http://localhost:30048/"
( 8) $ open "http://localhost:30080/your-project"
( 9) $ hf undeploy
(10) $ hf stop-server
(11) $ hf remove-domain
```

1. Change into your project
2. Initialize the configuration for your project.
	* Edit the Configuration
3. Create the domain
4. Start the application server
5. Create a JDB connection pool and JDBC resource
6. Start the deployment
7. Open the Admin Console of the application server
8. Open your deployed web/rest (etc) application
9. Undeploy the deployed application
10. Stop the application server
11. Remove and delete the domain.





[glassfish]: https://glassfish.java.net/
[payara]: http://www.payara.fish/
[nodejs]: https://nodejs.org/
[maven]: https://maven.apache.org/
