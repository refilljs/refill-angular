'use strict';

function defaultTask(options, gulp, mode) {


  gulp.task('default', options.dependencies, function(done) {
    var runSequence = require('run-sequence').use(gulp);
    mode.singleRun = false;
    runSequence.apply(this, options.sequence.concat([done]));
  });

}

module.exports = defaultTask;
