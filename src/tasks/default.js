'use strict';

function defaultTask(options, gulp) {

  gulp.task('default', options.dependencies, function(done) {
    var runSequence = require('run-sequence').use(gulp);
    runSequence.apply(this, options.sequence.concat([done]));
  });

}

module.exports = defaultTask;