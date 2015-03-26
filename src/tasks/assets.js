'use strict';

function assetsTask(options, gulp, mode) {

  gulp.task('assets', options.dependencies, function() {

    var imagemin = require('gulp-imagemin');
    var changed = require('gulp-changed');
    var gulpif = require('gulp-if');
    var watchLog = require('../watchLog');
    var baseDir = mode.dev ? 'dev/' : 'dist/';
    var stream;

    function assetsStream() {
      return gulp
        .src(options.globs, {
          base: 'src/'
        })
        .pipe(changed(baseDir))
        .pipe(gulpif(!mode.dev, imagemin()))
        .pipe(gulp.dest(baseDir));
    }

    stream = assetsStream();

    if (!mode.dev) {
      return stream;
    }

    watchLog('assets', gulp, options.globs, assetsStream);

    return stream;

  });

}

module.exports = assetsTask;
