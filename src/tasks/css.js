'use strict';

function cssTask(options, gulp, mode) {

  gulp.task('css', options.dependencies, function(doneCallback) {

    var less = require('gulp-less');
    var csso = require('gulp-csso');
    var streamify = require('gulp-streamify');
    var rev = require('gulp-rev');
    var gulpif = require('gulp-if');
    var cssLogger = require('../utils/logger')('css');
    var baseDir = mode.dev ? 'dev/' : 'dist/';
    var done = false;

    function cssStream() {
      return gulp
        .src('src/index.less')
        .pipe(less())
        .on('error', function(error) {
          cssLogger.error(error);
          if (mode.dev) {
            return;
          }
          done = true;
          doneCallback(error.message);
        })
        .pipe(gulpif(!mode.dev, csso()))
        .pipe(gulpif(!mode.dev, streamify(rev())))
        .pipe(gulp.dest(baseDir))
        .on('end', function() {
          cssLogger.finished();
          if (done) {
            return;
          }
          done = true;
          doneCallback();
        });
    }

    if (mode.dev) {
      gulp.watch(options.watchGlobs, cssStream)
        .on('change', cssLogger.start);
    }

    cssStream();

  });

}

module.exports = cssTask;
