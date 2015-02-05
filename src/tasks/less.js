'use strict';

function lessTask(gulp) {

  var less = require('gulp-less');
  var watchLog = require('../watchLog');

  var config = require('../defaults');

  gulp.task('less', ['bower'], function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';

    function humanLibraryLess() {
      return gulp
        .src('src/humanLibrary/index.less')
        .pipe(less())
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