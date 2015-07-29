'use strict';

function getTestTask(options, gulp, mode) {

  function testTask(next) {

    var karma = require('karma');
    var istanbul = require('browserify-istanbul');
    var zkutils = require('gulp-zkflow-utils');
    var _ = require('lodash');
    var q = require('q');
    var del = require('del');
    var globby = require('globby');

    var logger = new zkutils.Logger('test');
    var globDeferred = q.defer();

    var nextHandler;
    var testPromise;

    _.extend(mode, options.mode);

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    logger.start();

    globby(options.files, function(error, files) {
      if (error !== null) {
        globDeferred.reject(error);
        return;
      }
      if (files.length === 0) {
        globDeferred.reject('No test files found');
        return;
      }
      globDeferred.resolve(files);
      return;
    });

    testPromise = globDeferred.promise
      .then(function() {
        return q.nfcall(del, [options.reportsBaseDir + '**/*']);
      })
      .then(function() {

        var reporters = ['progress'];
        var server;
        var karmaDeferred = q.defer();

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
          logLevel: 'debug',
          frameworks: ['jasmine', 'browserify'],
          browserNoActivityTimeout: 120000,
          singleRun: !mode.watch,
          autoWatch: mode.watch,
          preprocessors: {
            'src/**/*': ['browserify']
          },
          browserify: {
            debug: true,
            configure: function(bundle) {
              bundle.on('update', logger.changed.bind(logger));
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

        return karmaDeferred.promise;

      });

    nextHandler.handle(testPromise);

  }

  return testTask;

}

module.exports = {
  getTask: getTestTask,
  defaultOptions: {
    files: ['src/unitTests.js'],
    reportsBaseDir: 'reports/test/',
    junitReporterOutputDir: 'junit/',
    htmlReporterOutputDir: 'html/',
    istanbulIgnore: ['**/node_modules/**/*', '**/bower_components/**/*', '**/*Spec.js', '**/unitTests.js'],
    istanbulReporters: [{
      type: 'html',
      subdir: 'coverageHtml'
    }, {
      type: 'clover',
      subdir: 'coverageClover'
    }]
  }
};
