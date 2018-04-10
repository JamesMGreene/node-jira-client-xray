'use strict';

// Node.js core modules
var url = require('url');
var util = require('util');

// Userland modules
var JiraApi = require('jira-client');



/**
 * @constructor
 * @param {JiraApiWithXrayOptions} options
 */
function JiraApiWithXray(options) {
  if (!(this instanceof JiraApiWithXray)) {
    return new JiraApiWithXray(options);
  }

  var opts = options || {};

  // Invoke the super constructor
  JiraApi.call(this, opts);

  this.xrayVersion = opts.xrayVersion || '1.0';
}

util.inherits(JiraApiWithXray, JiraApi);


/**
 * @typedef JiraApiWithXrayOptions
 * @type {object}
 * @property {string} [protocol=http] - What protocol to use to connect to
 * Jira? Ex: http|https
 * @property {string} host - What host is this tool connecting to for the Jira
 * instance? Ex: jira.somehost.com
 * @property {string} [port] - What port is this tool connecting to Jira with? Only needed for
 * none standard ports. Ex: 8080, 3000, etc
 * @property {string} [username] - Specify a username for this tool to authenticate all
 * requests with.
 * @property {string} [password] - Specify a password for this tool to authenticate all
 * requests with.
 * @property {string} [apiVersion=2] - What version of the Jira REST API is the instance the
 * tool is connecting to?
 * @property {string} [base] - What other url parts exist, if any, before the rest/api/
 * section?
 * @property {string} [intermediatePath] - If specified, overwrites the default rest/api/version
 * section of the uri
 * @property {boolean} [strictSSL=true] - Does this tool require each request to be
 * authenticated?  Defaults to true.
 * @property {function} [request] - What method does this tool use to make its requests?
 * Defaults to request from request-promise
 * @property {number} [timeout] - Integer containing the number of milliseconds to wait for a
 * server to send response headers (and start the response body) before aborting the request. Note
 * that if the underlying TCP connection cannot be established, the OS-wide TCP connection timeout
 * will overrule the timeout option ([the default in Linux can be anywhere from 20-120 *
 * seconds](http://www.sekuda.com/overriding_the_default_linux_kernel_20_second_tcp_socket_connect_timeout)).
 * @property {string} [webhookVersion=1.0] - What webhook version does this api wrapper need to
 * hit?
 * @property {string} [greenhopperVersion=1.0] - What webhook version does this api wrapper need
 * to hit?
 * @property {OAuth} [oauth] - Specify an OAuth object for this tool to authenticate all requests
 * using OAuth.
 * @property {string} [bearer] - Specify a OAuth bearer token to authenticate all requests with.
 * @property {string} [xrayVersion=1.0] - What version of the "Xray for Jira" REST API is the
 * instance the tool is connecting to?
 */

/**
 * @typedef OAuth
 * @type {object}
 * @property {string} consumer_key - The consumer entered in Jira Preferences.
 * @property {string} consumer_secret - The private RSA file.
 * @property {string} access_token - The generated access token.
 * @property {string} access_token_secret - The generated access toke secret.
 * @property {string} signature_method [signature_method=RSA-SHA1] - OAuth signurate methode
 * Possible values RSA-SHA1, HMAC-SHA1, PLAINTEXT. Jira Cloud supports only RSA-SHA1.
 */


/**
 * Creates a URI object for a given pathName within the "Xray for Jira" REST API
 * @param {makeXrayUriOptions} [options] - An options object specifying uri information
 */
JiraApiWithXray.prototype.makeXrayUri = function(options) {
  var opts = options || {};
  var intermediateToUse = this.intermediatePath || opts.intermediatePath;
  var tempPath = intermediateToUse || '/rest/raven/' + this.xrayVersion;
  var uri = url.format({
    protocol: this.protocol,
    hostname: this.host,
    port: this.port,
    pathname: this.base + tempPath + opts.pathname,
  });
  return decodeURIComponent(uri);
};

/**
 * @typedef makeXrayUriOptions
 * @type {object}
 * @property {string} pathname - The url after the /rest/raven/version
 * @property {string} intermediatePath - If specified will overwrite the /rest/raven/version section
 */


/*jshint ignore:start */
/**
 * Import Test Execution results into "Xray for Jira" using the Xray JSON format.
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-XrayJSONresults
 * @param {TestExecXrayJson} testExecResults - The results of the Test Execution in the Xray JSON format
 */
/*jshint ignore:end */
JiraApiWithXray.prototype.importExecResultsFromXray = function(testExecResults) {
  return this.doRequest(
    this.makeRequestHeader(
      this.makeXrayUri({
        method: 'POST',
        pathname: '/import/execution',
        body: testExecResults
      })
    )
  );
};

/*jshint ignore:start */
/**
 * @typedef TestExecXrayJson
 * @type {object}
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-XrayJSONformat
 * @property {string} [testExecutionKey] - The Jira issue key for an existing Test Execution that should be updated. If omitted, a new Test Execution is created automatically.
 * @property {TestExecXrayJsonInfo} [info] - Test Execution metadata
 * @property {TestExecXrayJsonTestRun[]} tests - The results of the Test Run
 */
/*jshint ignore:end */

/**
 * @typedef TestExecXrayJsonInfo
 * @type {object}
 * @property {string} [project] - The Jira project ID
 * @property {string} summary - Summary of the Test Execution
 * @property {string} [description] - Description of the Test Execution
 * @property {string} [user] - The Jira user logging the Test Execution results
 * @property {string} [version] - Version under test
 * @property {string} [revision] - The revision/build/branch under test
 * @property {string} [startDate] - The ISO date timestamp at which the Test Execution started
 * @property {string} [finishDate] - The ISO date timestamp at which the Test Execution finished
 * @property {string} [testPlanKey] - The Jira issue key for the associated Test Plan
 * @property {string[]} [testEnvironments] - The environmental configuration under test
 */

/**
 * @typedef TestExecXrayJsonTestRun
 * @type {object}
 * @property {string} testKey - The Jira issue key for the associated Test
 * @property {string} status - The "PASS" or "FAIL" status for the Test Run as a whole
 * @property {string} [comment] - A message about this Test Run
 * @property {string} [start] - The ISO date timestamp at which this Test Run started
 * @property {string} [finish] - The ISO date timestamp at which this Test Run finished
 * @property {string} [executedBy] - The Jira user who executed this Test Run
 * @property {TestExecXrayJsonEvidence[]} [evidences] - Attachments (e.g. screenshots) proving the Test Run's failure
 * @property {TestExecXrayJsonResult[]} [results] - Detailed results of individual test cases within this Test Run
 * @property {string[]} [examples] - The "PASS" or "FAIL" status for each of the Test Run's examples
 * @property {TestExecXrayJsonTestStep[]} [steps] - Details about each Test step and its outcome
 * @property {string[]} [defects] - The Jira issue keys for any associated bugs recorded during this Test Run
 */

/**
 * @typedef TestExecXrayJsonEvidence
 * @type {object}
 * @property {string} data - The base64-encoded string of data representing this attachment
 * @property {string} filename - The basename of the file associated with this attachment
 * @property {string} [contentType] - The MIME type associated with this attachment, e.g. "image/jpeg"
 */

/**
 * @typedef TestExecXrayJsonResult
 * @type {object}
 * @property {string} name - The name of the test case
 * @property {string} status - The "PASS" or "FAIL" status of this test case
 * @property {number} [duration] - The duration (milliseconds? seconds?)
 * @property {string} [log] - Any log messages that came out of this test case
 * @property {string[]} [examples] - The "PASS" or "FAIL" status for each of this test case's examples
 */

/**
 * @typedef TestExecXrayJsonTestStep
 * @type {object}
 * @property {string} status - The "PASS" or "FAIL" status of this step
 * @property {string} [comment] - A message about this step
 * @property {TestExecXrayJsonEvidence[]} [evidences] - Attachments (e.g. screenshots) proving this step's failure
 */


/**
 * Import Test Execution results into "Xray for Jira" using one of the supported JSON formats.
 * @access private
 * @param {string} type - The type of JSON result to be imported. Must be one of: "cucumber" or "behave".
 * @param {TestExecCucumberJson|TestExecBehaveJson} results - The results of the Test Execution
 * @param {JiraIssueCreationJson} [issueData] - Customized field data for creating a new Test Execution issue in Jira
 */
JiraApiWithXray.prototype._importExecResultsFromJson = function(type, results, issueData) {
  var hasIssueData = !!issueData;
  var requestOptions = {
        method: 'POST',
        pathname: '/import/execution/' + type + (hasIssueData ? '/multipart' : '')
      };

  if (hasIssueData) {
    requestOptions.formData = {
      result: results,
      info: issueData
    };
  }
  else {
    requestOptions.body = results;
  }

  return this.doRequest(
    this.makeRequestHeader(
      this.makeXrayUri(
        requestOptions
      )
    )
  );
};

/**
 * @external {JiraCloudIssueCreationJson} https://developer.atlassian.com/cloud/jira/platform/rest/#api-api-2-issue-post
 */

/*jshint ignore:start */
/**
 * @external {JiraServerIssueCreationJson} https://docs.atlassian.com/software/jira/docs/api/REST/7.9.0/#api/2/issue-createIssue
 */
/*jshint ignore:end */

/**
 * @typedef JiraIssueCreationJson
 * @type {JiraCloudIssueCreationJson|JiraServerIssueCreationJson}
 */


/*jshint ignore:start */
/**
 * Import Test Execution results into "Xray for Jira" using the Cucumber JSON format.
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-CucumberJSONresults
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-CucumberJSONresultsMultipart
 * @param {TestExecCucumberJson} testExecResults - The results of the Test Execution in the Cucumber JSON format
 * @param {JiraIssueCreationJson} [issueData] - Customized field data for creating a new Test Execution issue in Jira
 */
/*jshint ignore:end */
JiraApiWithXray.prototype.importExecResultsFromCucumber = function(testExecResults, issueData) {
  return this._importExecResultsFromJson('cucumber', testExecResults, issueData);
};

/*jshint ignore:start */
/**
 * @external {TestExecCucumberJson} https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-CucumberJSONoutputformat
 */
/*jshint ignore:end */


/*jshint ignore:start */
/**
 * Import Test Execution results into "Xray for Jira" using the Behave JSON format.
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-BehaveJSONresults
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-BehaveJSONresultsMultipart
 * @param {TestExecBehaveJson} testExecResults - The results of the Test Execution in the Behave JSON format
 * @param {JiraIssueCreationJson} [issueData] - Customized field data for creating a new Test Execution issue in Jira
 */
/*jshint ignore:end */
JiraApiWithXray.prototype.importExecResultsFromBehave = function(testExecResults, issueData) {
  return this._importExecResultsFromJson('behave', testExecResults, issueData);
};

/**
 * @external {TestExecBehaveJson} https://github.com/behave/behave/blob/master/behave/formatter/json.py
 */


/**
 * Import Test Execution results into "Xray for Jira" using one of the supported XML formats.
 * @access private
 * @param {string} type - The type of XML result to be imported. Must be one of: "junit", "testng", "nunit", or "robot".
 * @param {TestExecJUnitXml|TestExecTestNGXml|TestExecNUnitXml|TestExecRobotXml|string|Buffer|ReadableStream} results -
 * The results of the Test Execution in an XML formatted string
 * @param {XrayImportQueryParams} [query] - Field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 * @param {JiraIssueCreationJson} [issueData] - Customized field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 */
JiraApiWithXray.prototype._importExecResultsFromXml = function(type, results, query, issueData) {
  var hasQuery = !!query;
  var hasIssueData = !hasQuery && !!issueData;
  var requestOptions = {
        method: 'POST',
        pathname: '/import/execution/' + type + (hasIssueData ? '/multipart' : ''),
        formData: {
          file: results
        }
      };

  if (hasQuery) {
    var queryOptions = Object.assign({}, query);

    var testEnvs = queryOptions.testEnvironments || [];
    if (typeof testEnvs === 'string') {
      testEnvs = testEnvs.split(/\s*;\s*/);
    }
    if (Array.isArray(testEnvs)) {
      testEnvs = testEnvs.filter(function(te) { return !!te.replace(/^\s+|\s+$/g, ''); });
    }
    if (testEnvs.length) {
      queryOptions.testEnvironments = testEnvs.join(';');
    }

    requestOptions.query = queryOptions;
  }
  else if (hasIssueData) {
    requestOptions.form.info = issueData;
  }
  else {
    throw new TypeError('Must provide either the "query" or "issueData" parameter');
  }

  return this.doRequest(
    this.makeRequestHeader(
      this.makeXrayUri(
        requestOptions
      )
    )
  );
};

/**
 * @typedef XrayImportQueryParams
 * @type object
 * @property {string} [testExecKey] - The Jira issue key for an existing Test Execution that should be updated. If
 * omitted, a new Test Execution is created automatically in the Jira project indicated by `projectKey`. Either
 * `testExecKey` or `projectKey` must be provided.
 * @property {string} [projectKey] - The Jira project key where the new Test Execution issue should be created. Not
 * needed if `testExecKey` is provided. Either `testExecKey` or `projectKey` must be provided.
 * @property {string} [testPlanKey] - The Jira issue key for the associated Test Plan
 * @property {string|string[]} [testEnvironments] - The list of test environments. If provided as a string, items must
 * be delimited by a ";".
 * @property {string} [revision] - Source code and documentation version used in the Test Execution
 * @property {string} [fixVersion] - The Jira "Fix Version" to be associated with the Test Execution
 */


/*jshint ignore:start */
/**
 * Import Test Execution results into "Xray for Jira" using the JUnit XML format.
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-JUnitXMLresults
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-JUnitXMLresultsMultipart
 * @param {TestExecJUnitXml|string|Buffer|ReadableStream} testExecResults - The results of the Test Execution in the
 * JUnit XML formatted string
 * @param {XrayImportQueryParams} [query] - Field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 * @param {JiraIssueCreationJson} [issueData] - Customized field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 */
/*jshint ignore:end */
JiraApiWithXray.prototype.importExecResultsFromJUnit = function(testExecResults, query, issueData) {
  return this._importExecResultsFromXml('junit', testExecResults, query, issueData);
};

/*jshint ignore:start */
/**
 * @external {TestExecJUnitXml} https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-JUnitXMLoutputformat
 */
/*jshint ignore:end */


/*jshint ignore:start */
/**
 * Import Test Execution results into "Xray for Jira" using the TestNG XML format.
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-TestNGXMLresults
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-TestNGXMLresultsMultipart
 * @param {TestExecTestNGXml|string|Buffer|ReadableStream} testExecResults - The results of the Test Execution in the
 * TestNG XML formatted string
 * @param {XrayImportQueryParams} [query] - Field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 * @param {JiraIssueCreationJson} [issueData] - Customized field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 */
/*jshint ignore:end */
JiraApiWithXray.prototype.importExecResultsFromTestNG = function(testExecResults, query, issueData) {
  return this._importExecResultsFromXml('testng', testExecResults, query, issueData);
};

/*jshint ignore:start */
/**
 * @external {TestExecTestNGXml} https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-TestNGXMLoutputformat
 */
/*jshint ignore:end */


/*jshint ignore:start */
/**
 * Import Test Execution results into "Xray for Jira" using the NUnit XML format.
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-NUnitXMLresults
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-NUnitXMLresultsMultipart
 * @param {TestExecNUnitXml|string|Buffer|ReadableStream} testExecResults - The results of the Test Execution in the NUnit XML formatted string
 * @param {XrayImportQueryParams} [query] - Field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 * @param {JiraIssueCreationJson} [issueData] - Customized field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 */
/*jshint ignore:end */
JiraApiWithXray.prototype.importExecResultsFromNUnit = function(testExecResults, query, issueData) {
  return this._importExecResultsFromXml('nunit', testExecResults, query, issueData);
};

/*jshint ignore:start */
/**
 * @external {TestExecNUnit30Xml} https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-NUnitv3.0XMLoutputformat
 */
/*jshint ignore:end */

/*jshint ignore:start */
/**
 * @external {TestExecNUnit26Xml} https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results#ImportExecutionResults-NUnitv2.6XMLoutputformat
 */
/*jshint ignore:end */

/**
 * @typedef TestExecNUnitXml
 * @type {TestExecNUnit30Xml|TestExecNUnit26Xml}
 */


/*jshint ignore:start */
/**
 * Import Test Execution results into "Xray for Jira" using the Robot Framework XML format.
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-RobotFrameworkXMLresults
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-RobotFrameworkXMLresultsMultipart
 * @param {TestExecRobotXml|string|Buffer|ReadableStream} testExecResults - The results of the Test Execution in the
 * Robot Framework XML formatted string
 * @param {XrayImportQueryParams} [query] - Field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 * @param {JiraIssueCreationJson} [issueData] - Customized field data for creating a new Test Execution issue in Jira.
 * Either `query` or `issueData` must be provided but not both.
 */
/*jshint ignore:end */
JiraApiWithXray.prototype.importExecResultsFromRobot = function(testExecResults, query, issueData) {
  return this._importExecResultsFromXml('robot', testExecResults, query, issueData);
};

/**
 * @external {TestExecRobotXml} https://github.com/robotframework/robotframework/tree/master/doc/schema
 */


/*jshint ignore:start */
/**
 * Import multiple Test Execution results into "Xray for Jira" using a bundled compressed file (e.g. ZIP).
 * @see https://confluence.xpand-addons.com/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResults-REST-MultipleExecutionResults
 * @param {string|Buffer|ReadableStream} testExecResults - The results of the multiple Test Executions
 */
/*jshint ignore:end */
JiraApiWithXray.prototype.importMultipleExecResults = function(testExecResults) {
  return this.doRequest(
    this.makeRequestHeader(
      this.makeXrayUri({
        method: 'POST',
        pathname: '/import/execution/bundle',
        formData: {
          file: testExecResults
        }
      })
    )
  );
};



// Export
module.exports = JiraApiWithXray;
