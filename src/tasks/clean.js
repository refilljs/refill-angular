'use strict';

function getCleanTask() {

  function cleanTask(done) {

    var del = require('del');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('clean');

    logger.start();

    del(
      require('../getOutputDir')() + '**/*',
      function() {
        logger.finished();
        done();
      });

  }

  return cleanTask;

}

module.exports = {
  getTask: getCleanTask
};
