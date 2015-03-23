'use strict';

function ciTask(options, gulp) {

  var runSequence = require('run-sequence').use(gulp);

  var config = require('../internalOptions');

  gulp.task('ci', options.dependencies, function(done) {

    config.jsbeautifierVerifyOnly = true;

    runSequence.apply(this, options.sequence.concat([done]));

  });

}

module.exports = ciTask;
