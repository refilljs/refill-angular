'use strict';

function buildTask(gulp) {

  var runSequence = require('run-sequence').use(gulp);

  var config = require('../defaults');

  gulp.task('build', function(done) {

    config.dev = false;

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