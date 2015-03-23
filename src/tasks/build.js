'use strict';

function buildTask(gulp) {

  var runSequence = require('run-sequence').use(gulp);
  var internalOptions = require('../internalOptions');

  gulp.task('build', function(done) {

    internalOptions.dev = false;

    runSequence(
      'clean', [
        'inject',
        'templates',
        'assets',
        'glyphiconfont'
      ],
      done
    );

  });

}

module.exports = buildTask;
