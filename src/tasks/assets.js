'use strict';

function getAssetsTask(options, gulp, mode, getOutputDir) {

  function assetsTask(next) {

    var imagemin = require('gulp-imagemin');
    var changed = require('gulp-changed');
    var gulpif = require('gulp-if');
    var watch = require('gulp-watch');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('assets');
    var outputDir = getOutputDir();
    var nextHandler;
    var runAssetsPromise;

    function runAssets() {

      return nextHandler.handle(
        zkutils.promisify(
          gulp
          .src(options.globs, {
            base: 'src/'
          })
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

    runAssetsPromise = runAssets()
      .finally(function() {
        if (mode.watch) {
          watch(options.globs, function(event) {
            logger.changed(event);
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
    globs: 'src/**/_assets/**'
  }
};
