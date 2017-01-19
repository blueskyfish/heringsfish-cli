title: Heringsfish - About
---

![Heringsfish](assets/logo.png)

# About

Command Line Interface to manages the [Glassfish][glassfish] / [Payara][payara] Application Server
and the deployment on local or server machine.

## History

| Version    | Date       | Description
|------------|------------|-----------------------------------------
| 0.9.1      | 2016-01-16 | delete the code of the next version. It is not complete.
| 0.9.0      | 2017-01-06 | Simplify the app. Delete the action ~~config~~.
| 0.8.0      | 2016-11-28 | add the task `test`.
| 0.7.3      | 2016-11-21 | fixed: normilze path names.
| 0.7.2      | 2016-10-07 | fixed default timeout and improve readme.
| 0.7.1      | 2016-10-07 | fixed the timeout for commands and improve the documentation of the actions.
| 0.7.0      | 2016-07-31 | add jdbc action
| 0.6.3      | 2016-05-18 | fixed: add the dot
| 0.6.2      | 2016-05-18 | fixed: read the config settings
| 0.6.1      | 2016-05-18 | fixed: execute a command on windows.
| 0.6.0      | 2016-05-18 | read the command.asadmin command from the server-config.json. If a platform depended command is execute, then it can be separated between `win32` and `unix`. See the `server-config.json` example
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

```text
The MIT License (MIT)

Copyright (c) 2017 BlueSkyFish

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
