'use strict';

function getCleanTask(options, gulp, mode, getOutputDir) {

  function cleanTask(next) {

    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('clean');
    var nextHandler;

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: false,
      logger: logger
    });

    nextHandler.handle(zkutils.del(getOutputDir() + '**'));

  }

  return cleanTask;

}

module.exports = {
  getTask: getCleanTask
};
