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
    var jsLogger = require('../utils/logger')('js');
    var bundler;

    function rebundle() {

      var stream;

      stream = bundler.bundle();

      if (mode.dev) {
        stream = stream.on('error', jsLogger.error);
      }

      return stream
        .pipe(source('index.js'))
        .pipe(gulpif(!mode.dev, streamify(uglify())))
        .pipe(gulpif(!mode.dev, streamify(rev())))
        .pipe(gulp.dest(mode.dev ? 'dev/' : 'dist/'))
        .on('end', jsLogger.finished);

    }

    bundler = browserify({
      cache: {},
      packageCache: {},
      fullPaths: true,
      entries: mode.dev ? options.devEntries : options.distEntries,
      debug: mode.dev
    });

    bundler.transform(require('browserify-ngannotate'));

    if (mode.dev) {
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
    distEntries: ['./src/index.js']
  }
};
