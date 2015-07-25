'use strict';

function getCssTask(options, gulp, mode) {

  function cssTask(doneCallback) {

    var less = require('gulp-less');
    var csso = require('gulp-csso');
    var streamify = require('gulp-streamify');
    var rev = require('gulp-rev');
    var gulpif = require('gulp-if');
    var autoprefixer = require('gulp-autoprefixer');
    var cssLogger = require('gulp-zkflow-logger')('css');
    var outputDir = require('../getOutputDir')();
    var done = false;
    var _ = require('lodash');

    _.extend(mode, options.mode);

    function cssStream() {
      return gulp
        .src('src/index.less')
        .pipe(less())
        .on('error', function(error) {
          cssLogger.error(error);
          if (mode.env === 'dev') {
            return;
          }
          done = true;
          doneCallback(error.message);
        })
        .pipe(autoprefixer({
          cascade: false
        }))
        .pipe(gulpif(mode.env !== 'dev', csso()))
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(rev())))
        .pipe(gulp.dest(outputDir))
        .on('end', function() {
          cssLogger.finished();
          if (done) {
            return;
          }
          done = true;
          doneCallback();
        });
    }

    if (mode.watch) {
      gulp.watch(options.watchGlobs, cssStream)
        .on('change', cssLogger.start);
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
