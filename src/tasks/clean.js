'use strict';

function getCleanTask(options, gulp, mode) {

  function cleanTask(done) {

    var del = require('del');
    var cleanLogger = require('gulp-zkflow-logger')('clean');
    var _ = require('lodash');

    _.extend(mode, options.mode);

    del(
      require('../getOutputDir')() + '**/*',
      function() {
        cleanLogger.finished();
        done();
      });

  }

  return cleanTask;

}

module.exports = {
  getTask: getCleanTask
};
