'use strict';

function defaultTask(options, gulp) {

  var runSequence = require('run-sequence').use(gulp);
  var internalOptions = require('../internalOptions');

  gulp.task('default', options.dependencies, function(done) {

    internalOptions.singleRun = false;

    runSequence.apply(this, options.sequence.concat([done]));

  });

}

module.exports = defaultTask;
