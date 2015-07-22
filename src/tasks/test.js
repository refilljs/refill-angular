'use strict';

function getTestTask(options, gulp, mode) {

  function testTask(done) {

    var karma = require('karma');
    var istanbul = require('browserify-istanbul');
    var testLogger = require('gulp-zkflow-logger')('test');
    var reporters = ['progress'];
    var server;
    var _ = require('lodash');

    _.extend(mode, options.mode);

    if (mode.env !== 'dev') {
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
        singleRun: mode.env !== 'dev',
        autoWatch: mode.env === 'dev',
        preprocessors: {
          'src/**/*': ['browserify']
        },
        browserify: {
          debug: true,
          configure: function(bundle) {
            bundle.on('update', testLogger.start);
          },
          transform: [istanbul({
            ignore: options.istanbulIgnore
          })]
        },
        browsers: ['PhantomJS'],
        reporters: reporters,
        junitReporter: {
          outputDir: options.junitReporterOutputDir
        },
        coverageReporter: {
          dir: options.coverageReporterOutputDir,
          reporters: options.istanbulReporters
        }
      },
      function(exitStatus) {

        var errorMessage = 'task failed';

        if (mode.env !== 'dev') {
          if (exitStatus === 0) {
            testLogger.finished();
            done();
            return;
          }
          testLogger.error({
            message: errorMessage
          });
          done(errorMessage);
        }

      }
    );



    if (mode.env === 'dev') {

      server.on('run_complete', function() {
        testLogger.finished();
      });

      done();

    }

    server.start();

  }

  return testTask;

}

module.exports = {
  getTask: getTestTask,
  defaultOptions: {
    files: ['src/unitTests.js'],
    junitReporterOutputDir: 'reports/test/junit/',
    coverageReporterOutputDir: 'reports/test/',
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
