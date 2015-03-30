'use strict';

function jshintTask(options, gulp, mode) {

  gulp.task('jshint', options.dependencies, function() {

    var jshint = require('gulp-jshint');
    var jshintLogger = require('../utils/logger')('jshint');

    function jshintStream() {

      return gulp
        .src(options.globs)
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')))
        .pipe(jshint.reporter('fail'))
        .on('error', jshintLogger.error);

    }

    if (false === mode.dev) {
      return jshintStream();
    }

    jshintStream();

    gulp.watch(options.globs, jshintStream)
      .on('change', jshintLogger.start);

  });

}

module.exports = jshintTask;
