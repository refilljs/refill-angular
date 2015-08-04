'use strict';

function getJsTask(options, gulp, mode) {

  function jsTask() {

    var source = require('vinyl-source-stream');
    var browserify = require('browserify');
    var uglify = require('gulp-uglify');
    var rev = require('gulp-rev');
    var gulpif = require('gulp-if');
    var streamify = require('gulp-streamify');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('js');
    var bundler;
    var watchify;

    logger.start();

    function getEntries() {

      if (mode.env === 'prod') {
        return options.prodEntries;
      }

      if (mode.env === 'test') {
        return options.testEntries;
      }

      return options.devEntries;

    }

    function rebundle() {

      var stream;

      stream = bundler.bundle();

      if (mode.watch) {
        stream = stream.on('error', logger.error);
      }

      return stream
        .pipe(source('index.js'))
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(uglify())))
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(rev())))
        .pipe(gulp.dest(require('../getOutputDir')()))
        .on('end', logger.finished);

    }

    bundler = browserify({
      cache: {},
      packageCache: {},
      fullPaths: true,
      entries: getEntries(),
      debug: mode.env === 'dev'
    });

    bundler.transform(require('browserify-ngannotate'));

    if (mode.watch) {
      watchify = require('watchify');
      bundler = watchify(bundler);
      bundler.on('update', logger.changed);
      bundler.on('update', rebundle);
    }

    return rebundle();

  }

  return jsTask;

}

module.exports = {
  getTask: getJsTask,
  defaultOptions: {
    devEntries: ['./src/dev/index.js'],
    prodEntries: ['./src/index.js'],
    testEntries: ['./src/test/index.js']
  }
};
