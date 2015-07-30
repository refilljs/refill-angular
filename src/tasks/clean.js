'use strict';

function getCleanTask(options, gulp, mode) {

  function cleanTask(done) {

    var del = require('del');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('clean');
    var _ = require('lodash');

    _.extend(mode, options.mode);

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
