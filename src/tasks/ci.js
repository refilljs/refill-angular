'use strict';

function ciTask(gulp) {

  var runSequence = require('run-sequence').use(gulp);

  var config = require('../defaults');

  gulp.task('ci', function(done) {
    config.jsbeautifierVerifyOnly = true;
    runSequence(
      [
        'jsbeautifier',
        'build',
        'test'
      ],
      done
    );
  });

}

module.exports = ciTask;