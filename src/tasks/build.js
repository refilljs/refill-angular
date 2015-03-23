'use strict';

function buildTask(options, gulp) {

  var runSequence = require('run-sequence').use(gulp);
  var internalOptions = require('../internalOptions');

  gulp.task('build', options.dependencies, function(done) {

    internalOptions.dev = false;

    runSequence.apply(this, options.sequence.concat([done]));

  });

}

module.exports = buildTask;
