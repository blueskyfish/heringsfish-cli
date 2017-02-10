title: Heringsfish - Plugin Overview
---

<span class="fa fa-plug fa-4x"></span>

# Plugin Overview

A plugin is a javascript module and executes an action. The name of the plugin is the name of the action too.

## Create Own Plugin

* [Create Plugin Programmatically](config/plugin-create.html)
* Create Plugin with Pipeline Plugin.

## Builtin Plugins

An overview of the builtin plugins.

| Plugin                                                                 | Action      | Description
|------------------------------------------------------------------------|:-----------:|------------------------------------
| [<span class="fa fa-plug"></span> Help](plugins/plugin-help.html)      | `help`      | Shows the help to the action / plugin
| [<span class="fa fa-plug"></span> Init](plugins/plugin-init.html)      | `init`      | Initial the `Heringsfish` server config in the current project.
| **Application Server** | | &nbsp;
| [<span class="fa fa-plug"></span> Create Domain](plugins/plugin-create-domain.html) | `create-domain` | Creates the domain on the application server.
| [<span class="fa fa-plug"></span> Remove Domain](plugins/plugin-remove-domain.html) | `remove-domain` | Remove and delete the domain on the application server.
| [<span class="fa fa-plug"></span> Start Server](plugins/plugin-start-server.html)   | `start-server`  | Starts the application server with the domain.
| [<span class="fa fa-plug"></span> Stop Server](plugins/plugin-stop-server.html)     | `stop-server`   | Stops the application server with the domain.
| [<span class="fa fa-plug"></span> Restart Server](plugins/plugin-restart-server.html) | `restart-server` | Stops and starts the application server with the domain.
| [<span class="fa fa-plug"></span> Undeploy Application](plugins/plugin-undeploy.html) | `undeploy`       | Undeploy and remove application(s) from the application server.
| **Maven** | | &nbsp;
| [<span class="fa fa-plug"></span> Build Maven](plugins/plugin-build-maven.html)       | `build-maven`    | Build the application with maven.
| [<span class="fa fa-plug"></span> Clean Maven](plugins/plugin-clean-maven.html)       | `clean-maven`    | Executes the maven goal **clean**.
| [<span class="fa fa-plug"></span> Test Maven](plugins/plugin-test-maven.html)         | `test-maven`     | Executes the maven goal **test**.
| [<span class="fa fa-plug"></span> Deploy Maven](plugins/plugin-deploy-maven.html)     | `deploy-maven`   | Build the package with Maven and publish on the application server.
| **Derby Database** | | &nbsp;
| [<span class="fa fa-plug"></span> Start Derby Database](plugins/plugin-start-derby.html) | `start-derby` | Starts the builtin Derby database on the application server.
| [<span class="fa fa-plug"></span> Stop Derby Database](plugins/plugin-stop-derby.html)   | `start-derby` | Stops the builtin Derby database on the application server.

