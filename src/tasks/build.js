'use strict';

function buildTask(options, gulp, mode) {

  gulp.task('build', options.dependencies, function(done) {
    var runSequence = require('run-sequence').use(gulp);
    mode.dev = false;
    runSequence.apply(this, options.sequence.concat([done]));
  });

}

module.exports = buildTask;
