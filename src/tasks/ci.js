'use strict';

function ciTask(gulp) {

  var runSequence = require('run-sequence').use(gulp);

  var config = require('../internalOptions');

  gulp.task('ci', function(done) {
    config.jsbeautifierVerifyOnly = true;
    runSequence(
      [
        'beautify',
        'build',
        'test'
      ],
      done
    );
  });

}

module.exports = ciTask;