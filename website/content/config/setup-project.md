title: Heringsfish - Setup Project
---

# Setup a Project

The first 3 steps are very simple.

1. Install `Heringsfish` (`$ npm install -g heringsfish-cli`) *Maybe you need sudo for the command*
2. Change into your application project
3. Initialize the heringsfish (`$ hf init`)

Now you have the file `server-config.json` in your project. It is a simple json file.

**Example**

```json
{
    "name": "project-name"
    "version": "0.0.1",
    "maven": {
        "project": "-",
        "setting": "-"
    },
    "// and more": "..."
}
```

*The complete listing of [default config is found here](config/default-config.html)*





## Example Configuration

the configuration is separated in 2 parts.

* The project configuration: `server-config.json`.
* the user (developer) configuration: `test-project.json` (the name of the project is `test-project`).


### Project Config: "server-config.json"

```json
{
    "name": "test-project",
    "version": "0.1.0-SNAPSHOT",
    "server": {
        "home": "-"
    },
    "maven": {
        "home": "-",
        "setting": "{project.home}/setting.xml",
        "project": "{project.home}/pom.xml"
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
        },
        "jdbc": {
            "testDB": {
                "dataSourceClassName": "com.mysql.jdbc.jdbc2.optional.MysqlDataSource",
                "restype": "javax.sql.DataSource",
                "properties": {
                    "user": "{database.user}",
                    "password": "{database.password}",
                    "url": "jdbc:mysql://localhost:{database.port}/test"
                },
                "description": "This is the Test Database"
            }
        }
    },
    "command": {
        "timeout": 120000,
        "asadmin": {
            "win32": "{server.home}/bin/asadmin.bat",
            "unix": "{server.home}/bin/asadmin"
        },
        "maven": {
            "win32": "{maven.home}/bin/mvn.cmd",
            "unix": "{maven.home}/bin/mvn"
        },
        "ant": {
            "win32": "{ant.home}/bin/ant.bat",
            "unix": "{ant.home}/bin/ant"
        }
    },
    "settings": {
       "database": {
            "user": "//set in user config",
            "password": "//set in user config",
            "port": 3306
        },
        "email-password": "email secrets"        
    },
    "env": {
        "project.home": "{project.home}",
        "user.home": "{user.home}",
        "project.name": "{project.name}",
        "project.version": "{project.version}"
    }
}
```

### User Config: "test-project.json"

```json
{
    "settings": {
        "database": {
            "user": "db user",
            "password": "secret password"
        },
        "server": {
            "home": "{user.home}/developer/tools/payara-server-163"
        },
        "maven": {
            "home": "{user.home}/developer/tools/apache/maven-3.2.1"
        },
        "ant": {
            "home": "{user.home}/developer/tools/apache/ant-1.18"
        }
    },
    "env": {
        "project.test.external.access.api_key": "!23_@@RE-342"
    }
}
```
