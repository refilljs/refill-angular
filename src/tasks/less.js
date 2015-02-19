'use strict';

function lessTask(gulp) {

  var less = require('gulp-less');
  var notify = require('gulp-notify');
  var watchLog = require('../watchLog');
  var errorLog = require('../errorLog');

  var config = require('../internalOptions');

  gulp.task('less', ['bower'], function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';

    function humanLibraryLess() {
      return gulp
        .src('src/humanLibrary/index.less')
        .pipe(less())
        .on('error', errorLog('Less'))
        .pipe(gulp.dest(baseDir + 'humanLibrary/'));
    }

    if (config.dev) {
      gulp
        .watch([
          'src/**/*.less',
          'src/**/*.css'
        ],
        humanLibraryLess)
        .on('change', watchLog('less'));
    }

    return humanLibraryLess();

  });

}

module.exports = lessTask;