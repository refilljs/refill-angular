'use strict';

function getCleanTask(options, gulp, mode) {

  function cleanTask(done) {

    var del = require('del');
    var cleanLogger = require('../utils/logger')('clean');

    del(
      mode.dev ? 'dev/**/*' : 'dist/**/*',
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
