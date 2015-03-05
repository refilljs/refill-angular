'use strict';

function jsTask(gulp) {

  var source = require('vinyl-source-stream');
  var watchify = require('watchify');
  var browserify = require('browserify');
  var gutil = require('gulp-util');
  var uglify = require('gulp-uglify');
  var streamify = require('gulp-streamify');
  var rev = require('gulp-rev');
  var errorLog = require('../errorLog');

  var config = require('../internalOptions');

  gulp.task('js', ['bower'], function() {

    var bundler;

    function rebundle() {

      var stream;

      stream = bundler.bundle();

      if (config.dev) {
        stream = stream.on('error', errorLog('Browserify'));
      }

      stream = stream.pipe(source('index.js'));

      if (!config.dev) {
        stream = stream
          .pipe(streamify(uglify()))
          .pipe(streamify(rev()));
      }

      stream = stream
        .pipe(gulp.dest(config.dev ? 'dev/' : 'dist/'))
        .on('end', function() {
          gutil.log(gutil.colors.magenta('browserify'), 'finished');
        });

      return stream;

    }

    gutil.log(gutil.colors.magenta('browserify'), 'starting...');

    bundler = browserify({
      cache: {},
      packageCache: {},
      fullPaths: true,
      entries: ['./src/index.js'],
      debug: config.dev
    });

    bundler.transform(require('debowerify'));
    bundler.transform(require('browserify-ngannotate'));

    if (config.dev) {
      bundler = watchify(bundler);
      bundler.on('update', function(changedFiles) {
        gutil.log('Starting', gutil.colors.cyan('browserify'), 'file', event.path, 'changed');
      });
      bundler.on('update', rebundle);
    }

    return rebundle();

  });

}

module.exports = jsTask;