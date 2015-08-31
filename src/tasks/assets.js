'use strict';

function getAssetsTask(options, gulp, mode) {

  function assetsTask(next) {

    var imagemin = require('gulp-imagemin');
    var changed = require('gulp-changed');
    var gulpif = require('gulp-if');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('assets');
    var outputDir = require('../getOutputDir')();
    var nextHandler;
    var runAssetsPromise;

    logger.start();

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    function runAssets() {

      return nextHandler.handle(
        zkutils.promisify(
          gulp
          .src(options.globs, {
            base: 'src/'
          })
          .pipe(changed(outputDir))
          .pipe(gulpif(mode.env !== 'dev', imagemin()))
          .pipe(gulp.dest(outputDir))
        )
      );

    }

    runAssetsPromise = runAssets()
      .finally(function() {
        if (mode.watch) {
          gulp.watch(options.globs, function(path) {
            logger.changed(path);
            runAssetsPromise = runAssetsPromise.finally(runAssets);
          });
        }
      });

  }

  return assetsTask;

}

module.exports = {
  getTask: getAssetsTask,
  defaultOptions: {
    globs: 'src/**/_assets/**/*'
  }
};
