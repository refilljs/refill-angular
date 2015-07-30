'use strict';

function getAssetsTask(options, gulp, mode) {

  function assetsTask() {

    var imagemin = require('gulp-imagemin');
    var changed = require('gulp-changed');
    var gulpif = require('gulp-if');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('assets');
    var outputDir = require('../getOutputDir')();
    var _ = require('lodash');

    logger.start();

    _.extend(mode, options.mode);

    function assetsStream() {
      return gulp
        .src(options.globs, {
          base: 'src/'
        })
        .pipe(changed(outputDir))
        .pipe(gulpif(mode.env !== 'dev', imagemin()))
        .pipe(gulp.dest(outputDir))
        .on('end', logger.finished);
    }

    if (mode.watch) {
      gulp.watch(options.globs, assetsStream)
        .on('change', logger.changed);
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
