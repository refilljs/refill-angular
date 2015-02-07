'use strict';

function jsTask(gulp) {

  var source = require('vinyl-source-stream');
  var watchify = require('watchify');
  var browserify = require('browserify');
  var gutil = require('gulp-util');
  var notify = require('gulp-notify');
  var uglify = require('gulp-uglify');
  var streamify = require('gulp-streamify');

  var config = require('../internalOptions');

  gulp.task('js', ['bower'], function() {

    var bundler;

    function rebundle() {

      var stream;

      stream = bundler.bundle();

      if (config.dev) {
        stream = stream.on('error', notify.onError('Browserify error: <%= error.message %>'));
      }

      stream = stream.pipe(source('index.js'));

      if (!config.dev) {
        stream = stream.pipe(streamify(uglify()));
      }

      stream = stream
        .pipe(gulp.dest((config.dev ? 'dev/' : 'dist/') + 'humanLibrary/'))
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
      entries: ['./src/humanLibrary/index.js'],
      debug: config.dev
    });

    bundler.transform(require('debowerify'));
    bundler.transform(require('browserify-ngannotate'));

    if (config.dev) {
      bundler = watchify(bundler);
      bundler.on('update', function(changedFiles) {
        gutil.log(gutil.colors.magenta('watchify'), 'detected files', changedFiles, 'have changed, starting...');
      });
      bundler.on('update', rebundle);
    }

    return rebundle();

  });

}

module.exports = jsTask;