title: Heringsfish - Default Configuration
---

# Default Configuration

The section shows the default configuration If you have initialized the project for `Heringsfish`.

The description for the properties / Fields of the configuration is found in [Configuration](config/server-config.html)

```json
{
  "name": "-",
  "version": "0.0.1",
  "maven": {
    "project": "-",
    "setting": "-"
  },
  "ant": {
    "task": "default"
  },
  "command": {
    "timeout": 0,
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
  "domain": {
    "name": "-",
    "home": "{project.home}/domains",
    "deploy": {
    },
    "jdbc": {
      "JDBC-Name": {
        "dataSourceClassName": "com.mysql.jdbc.Driver",
        "restype": "javax.sql.DataSource",
        "properties": {
          "user": "{database.user}",
          "password": "{database:password}",
          "url": "jdbc:mysql://localhost:{database.port}/test"
        },
        "description": "This is a Test Connection"
      }
    },
    "ports": {
      "base": 30000
    }
  },
  "settings": {
    "server": {
      "home": "-"
    },
    "maven": {
      "home": "-"
    },
    "ant": {
      "home": "-"
    },
    "database": {
      "user": "myuser",
      "password": "mypassword",
      "port": 3306
    }
  },
  "env": {
    "project.home": "{project.home}",
    "user.home": "{user.home}",
    "project.name": "{project.name}",
    "project.version": "{project.version}"
  }
}

```
