'use strict';

function jsTask(options, gulp, mode) {

  gulp.task('js', options.dependencies, function() {

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

    bundler.transform(require('debowerify'));
    bundler.transform(require('browserify-ngannotate'));

    if (mode.dev) {
      bundler = watchify(bundler);
      bundler.on('update', jsLogger.start);
      bundler.on('update', rebundle);
    }

    return rebundle();

  });

}

module.exports = jsTask;
