'use strict';

function getCssTask(options, gulp, mode) {

  function cssTask(next) {

    var less = require('gulp-less');
    var csso = require('gulp-csso');
    var streamify = require('gulp-streamify');
    var rev = require('gulp-rev');
    var gulpif = require('gulp-if');
    var autoprefixer = require('gulp-autoprefixer');
    var plumber = require('gulp-plumber');
    var zkutils = require('gulp-zkflow-utils');
    var q = require('q');
    var outputDir = require('../getOutputDir')();
    var logger = zkutils.logger('css');
    var nextHandler;
    var runCssPromise;

    function runCss() {

      var promise = zkutils.globby(options.globs, 'No ' + options.globs + '  file found');

      return nextHandler.handle(promise, {
        ignoreFailures: true,
        handleSuccess: false
      }).then(function() {

        var deferred = q.defer();

        gulp.src(options.globs)
          .pipe(plumber(deferred.reject))
          .pipe(less())
          .pipe(autoprefixer({
            cascade: false
          }))
          .pipe(gulpif(mode.env !== 'dev' && !mode.watch, csso()))
          .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(rev())))
          .pipe(gulp.dest(outputDir))
          .on('end', deferred.resolve);

        return nextHandler.handle(deferred.promise);

      });

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    runCssPromise = runCss()
      .finally(function() {
        if (mode.watch) {
          gulp.watch(options.watchGlobs, function(path) {
            logger.changed(path);
            runCssPromise = runCssPromise.finally(runCss);
          });
        }
      });

  }

  return cssTask;

}

module.exports = {
  getTask: getCssTask,
  defaultOptions: {
    globs: 'src/index.less',
    watchGlobs: 'src/**/*.{less,css}'
  }
};
