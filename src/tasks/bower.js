'use strict';

var zkutils = require('gulp-zkflow-utils');
var bower = require('bower');
var zkflowWatcher = require('zkflow-watcher');

function getBowerTask(options, gulp, mode, getOutputDir) {

  function bowerTask(next) {

    var logger = zkutils.logger('bower');
    var nextHandler;

    var noBowerMessage =
      '\nNo bower.json found.\n\n' +
      'You can add bower.json and bower install will be handled automatically.\n' +
      'Learn more about bower:\n' +
      'http://bower.io/\n';

    function runBower() {

      var promise = zkutils.globby('bower.json', noBowerMessage);

      return nextHandler.handle(promise, {
        ignoreFailures: true,
        handleSuccess: false
      }).then(function() {
        return nextHandler.handle(zkutils.promisify(bower.commands.install())
          .then(function() {
            return zkutils.promisify(gulp
              .src(options.globs, options.globsOptions)
              .pipe(gulp.dest(getOutputDir() + options.outputDirSuffix)));
          }));
      });

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    zkflowWatcher.watch(runBower, mode.watch, 'bower.json', logger);

  }

  return bowerTask;

}

module.exports = {
  getTask: getBowerTask,
  defaultOptions: {
    globs: 'bower_components/**',
    globsOptions: {
      base: './'
    },
    outputDirSuffix: ''
  }
};
