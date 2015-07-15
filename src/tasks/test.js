'use strict';

function getTestTask(options, gulp, mode) {

  function testTask(done) {

    var karma = require('karma');
    var testLogger = require('gulp-zkflow-logger')('test');
    var reporters = ['progress'];

    if (!mode.dev) {
      reporters.push('junit');
    }

    karma.server.start({
      files: options.files,
      plugins: [
        require('karma-browserify'),
        require('karma-jasmine'),
        require('karma-junit-reporter'),
        require('karma-phantomjs-launcher')
      ],
      logLevel: 'warn',
      frameworks: ['jasmine', 'browserify'],
      browserNoActivityTimeout: 120000,
      singleRun: !mode.dev,
      autoWatch: mode.dev,
      preprocessors: {
        'src/**': ['browserify']
      },
      browserify: {
        debug: true,
        transform: [
          require('browserify-ngannotate')
        ]
      },
      browsers: ['PhantomJS'],
      junitReporter: {
        outputFile: options.junitReporterOutputFile
      },
      reporters: reporters
    }, function(exitStatus) {

      var errorMessage = 'task failed';

      if (!mode.dev) {
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

    });

    if (mode.dev) {
      testLogger.finished();
      done();
    }

  }

  return testTask;

}

module.exports = {
  getTask: getTestTask,
  defaultOptions: {
    files: ['src/unitTests.js'],
    junitReporterOutputFile: 'test-results.xml'
  }
};
