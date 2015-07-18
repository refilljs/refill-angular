'use strict';

function getAssetsTask(options, gulp, mode) {

  function assetsTask() {

    var imagemin = require('gulp-imagemin');
    var changed = require('gulp-changed');
    var gulpif = require('gulp-if');
    var assetsLogger = require('gulp-zkflow-logger')('assets');
    var outputDir = require('../getOutputDir')();

    function assetsStream() {
      return gulp
        .src(options.globs, {
          base: 'src/'
        })
        .pipe(changed(outputDir))
        .pipe(gulpif(mode.env !== 'dev', imagemin()))
        .pipe(gulp.dest(outputDir))
        .on('end', assetsLogger.finished);
    }

    if (mode.env === 'dev') {
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
