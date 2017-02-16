title: Heringsfish - Plugin "Pipeline"
---


<span class="fa fa-plug fa-4x"></span>

# Plugin "Pipeline"

## Description

The plugin `pipeline` is executing one plugin (*action*) after the other. The plugin
can be used to define your own tasks.

## Additional Parameters

* `--try` or `--test`<br>
  Do not execute the pipeline action. Shows only the pipeline action and their parameters.


## Plugin Settings

Every plugin could have a settings object in the plugin configuration. In
the plugin `pipeline` is the settings from the `PipelineSetting`.

**Pipeline Setting**

| Property             | Type          | Required | Description
|----------------------|:-------------:|:--------:|-----------------------------------
| `deplay`             | Number        | no       | The pause between the pipeline action in milli seconds. Default is 0.
| `pipeline`           | Array&lt;PipelineAction&gt; | yes | The array with the pipeline actions (action list).

**Pipeline Action**

| Property             | Type          | Required | Description
|----------------------|:-------------:|:--------:|--------------------------------------
| `action`             | String        | yes      | An existing plugin (action) of the plugin registry.
| `description`        | String        | no       | A short description of the action.
| `params`             | Array&lt;String&gt; | yes | The array of parameters for the action.



## Example

> The example shows two pipeline actions and their action list (`serve` and `shutdown`).

`server-config.json`

```json
{
  "name": "demo-service",
    
  "plugins": {
    "serve": {
      "name": "serve",
      "description": "A pipeline action for start the server and deploy",
      "path": "hf/plugins/plugin-pipeline.js",
      "help": "tools/plugins/help/plugin-help.txt",
      "settings": {
        "delay": 300,
        "pipeline": [
          {
            "action": "start-server",
            "description": "Starts the application server",
            "params": [
              "-v"
            ]
          },
          {
            "action": "start-derby",
            "description": "Starts the derby database on port 1527",
            "params": [
              "-v", "--home", "{project.home}/db", "--host", "localhost", "--port", "1527"
            ]
          },
          {
            "action": "deploy-maven",
            "description": "Starts to build the appplication with maven and deploy on application server",
            "params": [
              "--quite", "--clean", "--notest", "-profiles=developer"
            ]
          }
        ]
      }
    },
    "shutdown": {
      "name": "stop-all",
      "description": "Stops and shutdown all server",
      "path": "hf/plugins/plugin-pipeline.js",
      "help": "tools/plugins/help/plugin-stop-all.txt",
      "pipeline": [
        {
          "action": "stop-derby",
          "description": "Shutdown the derby database",
          "params": [
            "-v", "--host", "localhost", "--port", "1527"
          ]
        },
        {
          "action": "stop-server",
          "description": "Shutdown application server",
          "params": [
            "-v", "--kill"
          ]
        }
      ]
    }
  }
}
```

