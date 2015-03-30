'use strict';

function testTask(options, gulp, mode) {

  gulp.task('test', options.dependencies, function(done) {

    var karma = require('karma');
    var testLogger = require('../utils/logger')('test');

    karma.server.start({
      files: options.files,
      plugins: [
        require('karma-browserify'),
        require('karma-jasmine'),
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
          require('debowerify'),
          require('browserify-ngannotate')
        ],
        configure: function(bundle) {
          bundle.exclude(options.templatesModule);
          bundle.on('prebundle', function() {
            var stream = require('stream');
            var s = new stream.Readable();
            s._read = function() {};
            s.push('module.exports = angular.module(\'' + options.templatesModule + '\', []);');
            s.push(null);
            bundle.require(s, {
              expose: options.templatesModule
            });
          });
        }
      },
      browsers: ['PhantomJS']
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

  });

}

module.exports = testTask;
