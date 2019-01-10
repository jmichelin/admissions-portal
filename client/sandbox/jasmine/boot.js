/**
 Starting with version 2.0, this file "boots" Jasmine, performing all of the necessary initialization before executing the loaded environment and all of a project's specs. This file should be loaded after `jasmine.js` and `jasmine_html.js`, but before any project source files or spec files are loaded. Thus this file can also be used to customize Jasmine for a project.

 If a project is using Jasmine via the standalone distribution, this file can be customized directly. If a project is using Jasmine via the [Ruby gem][jasmine-gem], this file can be copied into the support directory via `jasmine copy_boot_js`. Other environments (e.g., Python) will have different mechanisms.

 The location of `boot.js` can be specified and/or overridden in `jasmine.yml`.

 [jasmine-gem]: http://github.com/pivotal/jasmine-gem
 */
try {
(function() {

  /**
   * ## Require &amp; Instantiate
   *
   * Require Jasmine's core files. Specifically, this requires and attaches all of Jasmine's code to the `jasmine` reference.
   */
  self.jasmine = jasmineRequire.core(jasmineRequire);

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;

  self.Test = {}

  Test.setTimeout = function (fn, ms, onFailure, onSuccess) {
    if (!onFailure) throw new Error("onFailure (3rd param) required for Test.setTimeout")

    setTimeout(function() {
      try {
        fn();
        if (onSuccess) onSuccess();
      }
      catch(e) {
        onFailure(e);
      }
    }, ms);
  }

  /**
   * Since this is being run in a browser and the results should populate to an HTML page, require the HTML-specific Jasmine code, injecting the same reference.
   */
  // jasmineRequire.html(jasmine);

  /**
   * Create the Jasmine environment. This is used to run all specs in a project.
   */
  var env = self.jasmineEnv = jasmine.getEnv();

  /**
   * ## The Global Interface
   *
   * Build up the functions that will be exposed as the Jasmine public interface. A project can customize, rename or alias any of these functions as desired, provided the implementation remains unchanged.
   */
  var jasmineInterface = self.jasmineInterface = jasmineRequire.interface(jasmine, env);

  /**
   * Add all of the Jasmine global/public interface to the global scope, so a project can use the public interface directly. For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
   */
  extend(self, jasmineInterface);

  /**
   * ## Runner Parameters
   *
   * More browser specific code - wrap the query string in an object and to allow for getting/setting parameters from the runner user interface.
   */

  // var queryString = new jasmine.QueryString({
  //   getWindowLocation: function() { return self.location; }
  // });

  // var catchingExceptions = queryString.getParam("catch");
  env.catchExceptions(true);

  // var throwingExpectationFailures = queryString.getParam("throwFailures");
  env.throwOnExpectationFailure(false);

  /**
   * ## Reporters
   * The `HtmlReporter` builds all of the HTML UI for the runner page. This reporter paints the dots, stars, and x's for specs, as well as all spec names and all failures (if any).
   */
  // var htmlReporter = new jasmine.HtmlReporter({
  //   env: env,
  //   onRaiseExceptionsClick: function() { queryString.navigateWithNewParam("catch", !env.catchingExceptions()); },
  //   onThrowExpectationsClick: function() { queryString.navigateWithNewParam("throwFailures", !env.throwingExpectationFailures()); },
  //   addToExistingQueryString: function(key, value) { return queryString.fullStringWithNewParam(key, value); },
  //   getContainer: function() { return document.body; },
  //   createElement: function() { return document.createElement.apply(document, arguments); },
  //   createTextNode: function() { return document.createTextNode.apply(document, arguments); },
  //   timer: new jasmine.Timer()
  // });

  /**
   * The `jsApiReporter` also receives spec results, and is used by any environment that needs to extract the results  from JavaScript.
   */
  var noopTimer = {
    start: function(){},
    elapsed: function(){ return 0; }
  };

  self.challengeReporter = new ChallengeReporter({});
  env.addReporter(self.challengeReporter);

  function ChallengeReporter (options) {
    var timer = options.timer || noopTimer,
        status = 'loaded';

    this.started = false;
    this.finished = false;

    this.jasmineStarted = function() {
      this.started = true;
      status = 'started';
      timer.start();
    };

    var executionTime;

    this.jasmineDone = function() {
      this.finished = true;
      executionTime = timer.elapsed();
      status = 'done';
      postMessage({ specResults: this.specs(), executionTime: executionTime });
      postMessage('__terminate__');
    };

    this.status = function() {
      return status;
    };

    var suites = [],
      suites_hash = {};

    this.suiteStarted = function(result) {
      console.log("Starting", result.id);
      suites_hash[result.id] = result;
    };

    this.suiteDone = function(result) {
      storeSuite(result);
    };

    this.suiteResults = function(index, length) {
      return suites.slice(index, index + length);
    };

    function storeSuite(result) {
      suites.push(result);
      suites_hash[result.id] = result;
    }

    this.suites = function() {
      return suites_hash;
    };

    var specs = [];

    this.specDone = function(result) {
      specs.push(result);
      // We are currently in a web worker;
      // Send back result to the browser.
      postMessage({ answer: result, testCaseIdx: result.id });
    };

    this.specResults = function(index, length) {
      return specs.slice(index, index + length);
    };

    this.specs = function() {
      return specs;
    };

    this.executionTime = function() {
      return executionTime;
    };

  }

  /**
   * Filter which specs will be run by matching the start of the full name against the `spec` query param.
   */
  // var specFilter = new jasmine.HtmlSpecFilter({
  //   filterString: function() { return queryString.getParam("spec"); }
  // });

  // env.specFilter = function(spec) {
  //   return specFilter.matches(spec.getFullName());
  // };

  /**
   * ## Execution
   *
   * Make sure something calls jasmineEnv.execute();
   */

  /**
   * Helper function for readability above.
   */
  function extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  }

}());

} catch (e) {
  var trace = printStackTrace({ e: e });
  postMessage({ error: { name: e.name, message: e.message }, trace: trace });
}