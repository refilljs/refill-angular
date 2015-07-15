'use strict';

function getAssetsTask(options, gulp, mode) {

  function assetsTask() {

    var imagemin = require('gulp-imagemin');
    var changed = require('gulp-changed');
    var gulpif = require('gulp-if');
    var assetsLogger = require('gulp-zkflow-logger')('assets');
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

  }

  return assetsTask;

}

module.exports = {
  getTask: getAssetsTask,
  defaultOptions: {
    globs: 'src/**/_assets/**/*'
  }
};
