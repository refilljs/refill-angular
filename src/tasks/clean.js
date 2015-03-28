'use strict';

function cleanTask(options, gulp, mode) {


  gulp.task('clean', options.dependencies, function(done) {

    var del = require('del');
    var cleanLogger = require('../utils/logger')('clean');

    del(
      mode.dev ? 'dev/**' : 'dist/**',
      function() {
        cleanLogger.finished();
        done();
      });

  });

}

module.exports = cleanTask;
