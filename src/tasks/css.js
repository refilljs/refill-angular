'use strict';

function getCssTask(options, gulp, mode) {

  function cssTask(doneCallback) {

    var less = require('gulp-less');
    var csso = require('gulp-csso');
    var streamify = require('gulp-streamify');
    var rev = require('gulp-rev');
    var gulpif = require('gulp-if');
    var autoprefixer = require('gulp-autoprefixer');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('css');
    var outputDir = require('../getOutputDir')();
    var done = false;

    logger.start();

    function cssStream() {
      return gulp
        .src('src/index.less')
        .pipe(less())
        .on('error', function(error) {
          logger.error(error);
          if (mode.env === 'dev') {
            return;
          }
          done = true;
          doneCallback(error.message);
        })
        .pipe(autoprefixer({
          cascade: false
        }))
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, csso()))
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(rev())))
        .pipe(gulp.dest(outputDir))
        .on('end', function() {
          logger.finished();
          if (done) {
            return;
          }
          done = true;
          doneCallback();
        });
    }

    if (mode.watch) {
      gulp.watch(options.watchGlobs, cssStream)
        .on('change', logger.changed);
    }

    cssStream();

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
