'use strict';

function getJsTask(options, gulp, mode) {

  function jsTask() {

    var source = require('vinyl-source-stream');
    var watchify = require('watchify');
    var browserify = require('browserify');
    var uglify = require('gulp-uglify');
    var rev = require('gulp-rev');
    var gulpif = require('gulp-if');
    var streamify = require('gulp-streamify');
    var jsLogger = require('gulp-zkflow-logger')('js');
    var bundler;
    var _ = require('lodash');

    _.extend(mode, options.mode);

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
        stream = stream.on('error', jsLogger.error);
      }

      return stream
        .pipe(source('index.js'))
        .pipe(gulpif(mode.env !== 'dev', streamify(uglify())))
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(rev())))
        .pipe(gulp.dest(require('../getOutputDir')()))
        .on('end', jsLogger.finished);

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
      bundler = watchify(bundler);
      bundler.on('update', jsLogger.start);
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
