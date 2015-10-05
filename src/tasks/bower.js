'use strict';

function getBowerTask(options, gulp, mode, getOutputDir) {

  function bowerTask(next) {

    var zkutils = require('gulp-zkflow-utils');
    var watch = require('gulp-watch');
    var bower = require('bower');
    var logger = zkutils.logger('bower');
    var nextHandler;
    var runBowerPromise;

    var noBowerMessage =
      '\nNo bower.json found.\n\n' +
      'You can add bower.json and bower install will be handled automatically.\n' +
      'Learn more about bower:\n' +
      'http://bower.io/\n';

    function runBower() {

      var promise = zkutils.globby('bower.json', noBowerMessage);

      promise = nextHandler.handle(promise, {
        ignoreFailures: true,
        handleSuccess: false
      }).then(function() {
        return zkutils.promisify(bower.commands.install());
      }).then(function() {
        return zkutils.promisify(gulp
          .src(options.globs, options.globsOptions)
          .pipe(gulp.dest(getOutputDir() + options.outputDirSuffix)));
      });

      return nextHandler.handle(promise);

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    runBowerPromise = runBower()
      .finally(function() {
        if (mode.watch) {
          watch('bower.json', function(event) {
            logger.changed(event);
            runBowerPromise = runBowerPromise.finally(runBower);
          });
        }
      });

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
