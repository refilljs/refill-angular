'use strict';

function assetsTask(options, gulp, mode) {

  gulp.task('assets', options.dependencies, function() {

    var imagemin = require('gulp-imagemin');
    var changed = require('gulp-changed');
    var gulpif = require('gulp-if');
    var assetsLogger = require('../utils/logger')('assets');
    var baseDir = mode.dev ? 'dev/' : 'dist/';

    function assetsStream() {
      return gulp
        .src(options.globs, {
          base: 'src/'
        })
        .pipe(changed(baseDir))
        .pipe(gulpif(!mode.dev, imagemin()))
        .pipe(gulp.dest(baseDir))
        .on('end', assetsLogger.finished);
    }

    if (mode.dev) {
      gulp.watch(options.globs, assetsStream)
        .on('change', assetsLogger.start);
    }

    return assetsStream();

  });

}

module.exports = assetsTask;
