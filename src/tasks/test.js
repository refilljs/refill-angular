'use strict';

function getTestTask(options, gulp, mode) {

  function testTask(next) {

    var zkutils = require('gulp-zkflow-utils');

    var logger = zkutils.logger('test');

    logger.start();

    function startTest() {

      var karma = require('karma');
      var istanbul = require('browserify-istanbul');
      var q = require('q');
      var nextHandler;
      var testPromise;

      nextHandler = new zkutils.NextHandler({
        next: next,
        watch: mode.watch,
        logger: logger
      });

      testPromise = zkutils.globby(options.files, 'Test files not found')
        .then(zkutils.del.bind(undefined, options.reportsBaseDir + '**/*'))
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
            logLevel: 'error',
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

          return karmaDeferred.promise;

        });

      nextHandler.handle(testPromise);

    }

    zkutils.globby(options.files)
      .then(startTest, function() {
        logger.info('No test files found');
        logger.finished();
        next();
      });

  }

  return testTask;

}

module.exports = {
  getTask: getTestTask,
  defaultOptions: {
    files: ['src/**/*Spec.js'],
    reportsBaseDir: 'reports/test/',
    junitReporterOutputDir: 'junit/',
    htmlReporterOutputDir: 'html/',
    istanbulIgnore: [
      '**/node_modules/**/*',
      '**/bower_components/**/*',
      '**/*Spec.js'
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
