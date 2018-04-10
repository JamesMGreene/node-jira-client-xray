# `jira-client-xray`
[![NPM version](https://img.shields.io/npm/v/jira-client-xray.svg)](https://www.npmjs.com/package/jira-client-xray) [![License](https://img.shields.io/github/license/JamesMGreene/node-jira-client-xray.svg)](https://github.com/JamesMGreene/node-jira-client-xray/blob/master/LICENSE) [![Build Status](https://img.shields.io/travis/JamesMGreene/node-jira-client-xray/master.svg)](https://travis-ci.org/JamesMGreene/node-jira-client-xray) [![Dependency Status](https://img.shields.io/david/JamesMGreene/node-jira-client-xray.svg)](https://david-dm.org/JamesMGreene/node-jira-client-xray) [![Dev Dependency Status](https://img.shields.io/david/dev/JamesMGreene/node-jira-client-xray.svg)](https://david-dm.org/JamesMGreene/node-jira-client-xray#info=devDependencies)

An extended wrapper of the existing [`jira-client`](https://www.npmjs.com/package/jira-client) module, which adds support for the ["Xray for Jira"](https://confluence.xpand-addons.com/display/XRAY/) Test Management plugin's [REST API](https://confluence.xpand-addons.com/display/XRAY/REST+API).


## Installation

```shell
$ npm install --save jira-client-xray
```


## API

### Create A Client

```js
var JiraApiWithXray = require('jira-client-xray');

// Initialize
var jira = new JiraApiWithXray({
  strictSSL: true,
  protocol: 'https',
  username: 'username',
  password: 'password',
  host: 'jira.somehost.com',
  base: 'jira',
  xrayVersion: '1.0'
});
```

The constructor `options` parameter is a superset of the [`jira-client`](https://www.npmjs.com/package/jira-client) module's constructor's `options` parameter. It contains all of those configuration options, plus the following additional properties:
 - `xrayVersion` _(string)_ - The REST API version of the "Xray for Jira" plugin. Defaults to `'1.0'`.


### Import Test Execution Results

For deeper documentation, please view our [ESDoc-generated documentation](https://jamesmgreene.github.io/node-jira-client-xray/).

##### Response Schema

The HTTP response object (referred to as the "testExecIssueId" in all subsequent examples) returned from the `Promise` for each of the following import methods is as follows:

```json
{
  "testExecIssue": {
    "id": "10000",
    "key": "DEMO-123",
    "self": "http://www.example.com/jira/rest/api/2/issue/10000"
  }
}
```

##### Jira Issue Customization Request Schema

The JSON schema for the `issueData` parameter that is an optional part of some of these API calls is as follows:

[![Jira Cloud](https://img.shields.io/badge/Jira%2FCloud--blue.svg)](https://developer.atlassian.com/cloud/jira/platform/rest/#api-api-2-issue-post) [![Jira Server](https://img.shields.io/badge/Jira%2FServer-v7.9.0-blue.svg)](https://docs.atlassian.com/software/jira/docs/api/REST/7.9.0/#api/2/issue-createIssue)


#### Xray JSON

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-XrayJSONresults) [![Request Schema](https://img.shields.io/badge/Request%2FSchema--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-XrayJSONformat)

```js
jira
  .importExecResultsFromXray(testExecResults)
  .then(function(testExecIssueId) { /* ... */ });
```


#### Cucumber JSON

[![Request Schema](https://img.shields.io/badge/Request%2FSchema--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-CucumberJSONoutputformat)

##### Results Only

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-CucumberJSONresults)

```js
jira
  .importExecResultsFromCucumber(testExecResults)
  .then(function(testExecIssueId) { /* ... */ });
```

##### With JIRA Issue Customization

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-CucumberJSONresultsMultipart)

```js
jira
  .importExecResultsFromCucumber(testExecResults, issueData)
  .then(function(testExecIssueId) { /* ... */ });
```


#### Behave JSON

[![Request Schema](https://img.shields.io/badge/Request%2FSchema--blue.svg)](https://github.com/behave/behave/blob/master/behave/formatter/json.py)

##### Results Only

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-BehaveJSONresults)

```js
jira
  .importExecResultsFromBehave(testExecResults)
  .then(function(testExecIssueId) { /* ... */ });
```

##### With JIRA Issue Customization

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-BehaveJSONresultsMultipart)

```js
jira
  .importExecResultsFromBehave(testExecResults, issueData)
  .then(function(testExecIssueId) { /* ... */ });
```


#### JUnit XML

[![Request Schema](https://img.shields.io/badge/Request%2FSchema--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-JUnitXMLoutputformat)

##### Results Only

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-JUnitXMLresults)

```js
jira
  .importExecResultsFromJUnit(testExecResults, query)
  .then(function(testExecIssueId) { /* ... */ });
```

##### With JIRA Issue Customization

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-JUnitXMLresultsMultipart)

```js
jira
  .importExecResultsFromJUnit(testExecResults, null, issueData)
  .then(function(testExecIssueId) { /* ... */ });
```


#### TestNG XML

[![Request Schema](https://img.shields.io/badge/Request%2FSchema--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-TestNGXMLoutputformat)

##### Results Only

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-TestNGXMLresults)

```js
jira
  .importExecResultsFromTestNG(testExecResults, query)
  .then(function(testExecIssueId) { /* ... */ });
```

##### With JIRA Issue Customization

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-TestNGXMLresultsMultipart)

```js
jira
  .importExecResultsFromTestNG(testExecResults, null, issueData)
  .then(function(testExecIssueId) { /* ... */ });
```


#### NUnit XML

[![Request Schema v3.0](https://img.shields.io/badge/Request%2FSchema-v3.0-blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-NUnitv3.0XMLoutputformat) [![Request Schema v2.6](https://img.shields.io/badge/Request%2FSchema-v2.6-blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-NUnitv2.6XMLoutputformat)

##### Results Only

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-NUnitXMLresults)

```js
jira
  .importExecResultsFromNUnit(testExecResults, query)
  .then(function(testExecIssueId) { /* ... */ });
```

##### With JIRA Issue Customization

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-NUnitXMLresultsMultipart)

```js
jira
  .importExecResultsFromNUnit(testExecResults, null, issueData)
  .then(function(testExecIssueId) { /* ... */ });
```


#### Robot Framework XML

[![Request Schema](https://img.shields.io/badge/Request%2FSchema--blue.svg)](https://github.com/robotframework/robotframework/tree/master/doc/schema)

##### Results Only

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-RobotFrameworkXMLresults)

```js
jira
  .importExecResultsFromRobot(testExecResults, query)
  .then(function(testExecIssueId) { /* ... */ });
```

##### With JIRA Issue Customization

[![API Documentation](https://img.shields.io/badge/API%2FDocumentation--blue.svg)](https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-RobotFrameworkXMLresultsMultipart)

```js
jira
  .importExecResultsFromRobot(testExecResults, null, issueData)
  .then(function(testExecIssueId) { /* ... */ });
```



## License

Copyright (c) 2018, James M. Greene (MIT License)
