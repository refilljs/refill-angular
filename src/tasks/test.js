'use strict';

function getTestTask(options, gulp, mode) {

  function testTask(next) {

    var zkutils = require('gulp-zkflow-utils');
    var karma = require('karma');
    var istanbul = require('browserify-istanbul');
    var watch = require('gulp-watch');
    var q = require('q');
    var logger = zkutils.logger('test');
    var nextHandler;

    function runTest() {

      var reporters = ['progress'];
      var karmaDeferred = q.defer();
      var server;

      if (!mode.watch) {
        reporters.push('junit', 'coverage');
      }

      server = new karma.Server({
        files: options.files,
        plugins: [
          require('karma-browserify'),
          require('karma-jasmine'),
          require('karma-junit-reporter'),
          require('karma-phantomjs-launcher'),
          require('karma-coverage')
        ],
        logLevel: 'error',
        frameworks: ['jasmine', 'browserify'],
        browserNoActivityTimeout: 120000,
        singleRun: !mode.watch,
        autoWatch: mode.watch,
        preprocessors: {
          'src/**': ['browserify']
        },
        browserify: {
          debug: true,
          configure: function(bundle) {
            bundle.on('update', logger.changed);
          },
          transform: [istanbul({
            ignore: options.istanbulIgnore
          })]
        },
        browsers: ['PhantomJS'],
        reporters: reporters,
        junitReporter: {
          outputDir: options.reportsBaseDir + options.junitReporterOutputDir
        },
        coverageReporter: {
          dir: options.reportsBaseDir,
          reporters: options.istanbulReporters
        }
      }, function() {
        // without this empty function karma will stop execution of entire script after tests
      });

      server.on('run_complete', function(browsers, results) {

        var oldKarmaDeferred = karmaDeferred;

        karmaDeferred = q.defer();
        nextHandler.handle(karmaDeferred.promise);

        if (results.exitCode === 0) {
          oldKarmaDeferred.resolve();
          return;
        }

        oldKarmaDeferred.reject('failed');

      });

      server.start();

      return nextHandler.handle(karmaDeferred.promise);

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    nextHandler.handle(
        zkutils.del(options.reportsBaseDir + '**')
        .then(zkutils.globby.bind(undefined, options.files, 'No test files found')), {
          ignoreFailures: true,
          handleSuccess: false
        })
      .then(runTest, function() {
        var watchStream = watch(options.files, function(event) {
          watchStream.close();
          logger.changed(event);
          runTest();
        });
      });

  }

  return testTask;

}

module.exports = {
  getTask: getTestTask,
  defaultOptions: {
    files: ['src/**Spec.js'],
    reportsBaseDir: 'reports/test/',
    junitReporterOutputDir: 'junit/',
    htmlReporterOutputDir: 'html/',
    istanbulIgnore: [
      '**/node_modules/**',
      '**/bower_components/**',
      '**Spec.js'
    ],
    istanbulReporters: [{
      type: 'html',
      subdir: 'coverageHtml'
    }, {
      type: 'clover',
      subdir: 'coverageClover'
    }]
  }
};
