'use strict';

function getCleanTask() {

  function cleanTask(done) {

    var del = require('del');
    var cleanLogger = require('gulp-zkflow-logger')('clean');

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
