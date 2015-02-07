'use strict';

function defaultTask(gulp) {

  var runSequence = require('run-sequence').use(gulp);
  var internalOptions = require('../internalOptions');

  gulp.task('default', function(done) {

    internalOptions.singleRun = false;

    runSequence(
      'clean', [
        'inject',
        'templates',
        'assets',
        'glyphiconfont',
        'test'
      ],
      'webserver',
      done
    );

  });

}

module.exports = defaultTask;