'use strict';

var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var gulpif = require('gulp-if');
var zkutils = require('gulp-zkflow-utils');
var zkflowWatcher = require('zkflow-watcher');

function getAssetsTask(options, gulp, mode, getOutputDir) {

  function assetsTask(next) {

    var logger = zkutils.logger('assets');
    var outputDir = getOutputDir();
    var nextHandler;

    function runAssets() {

      return nextHandler.handle(
        zkutils.promisify(
          gulp
          .src(options.globs, options.globsOptions)
          .pipe(changed(outputDir))
          .pipe(gulpif(mode.env !== 'dev', imagemin(options.imagemin)))
          .pipe(gulp.dest(outputDir))
        )
      );

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    zkflowWatcher.watch(runAssets, mode.watch, options.globs, logger);

  }

  return assetsTask;

}

module.exports = {
  getTask: getAssetsTask,
  defaultOptions: {
    globs: 'src/**/_assets/**',
    globsOptions: {
      base: 'src/'
    }
  }
};
