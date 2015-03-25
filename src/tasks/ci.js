'use strict';

function ciTask(options, gulp, mode) {

  gulp.task('ci', options.dependencies, function(done) {
    var runSequence = require('run-sequence').use(gulp);
    mode.jsbeautifierVerifyOnly = true;
    mode.jshintFailOnError = true;
    mode.singleRun = true;
    mode.dev = false;
    runSequence.apply(this, options.sequence.concat([done]));
  });

}

module.exports = ciTask;
