'use strict';

function getBowerTask(options, gulp, mode) {

  function bowerTask(next) {

    var zkutils = require('gulp-zkflow-utils');
    var bower = require('bower');
    var logger = zkutils.logger('bower');
    var nextHandler;
    var runBowerPromise;

    function runBower() {

      var promise = zkutils.globby('bower.json', 'No bower.json file found');

      return nextHandler.handle(promise, {
        ignoreFailures: true,
        handleSuccess: false
      }).then(function() {
        return nextHandler.handle(zkutils.promisify(bower.commands.install()));
      });

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    runBowerPromise = runBower()
      .finally(function() {
        if (mode.watch) {
          gulp.watch('bower.json', function(path) {
            logger.changed(path);
            runBowerPromise = runBowerPromise.finally(runBower);
          });
        }
      });

  }

  return bowerTask;

}

module.exports = {
  getTask: getBowerTask
};
