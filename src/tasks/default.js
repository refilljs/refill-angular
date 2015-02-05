'use strict';

function defaultTask(gulp) {

  var runSequence = require('run-sequence').use(gulp);
  var config = require('../defaults');

  gulp.task('default', function(done) {

    config.singleRun = false;

    runSequence(
      'clean', [
        'webserver-dev',
        'test'
      ],
      done
    );

  });

}

module.exports = defaultTask;