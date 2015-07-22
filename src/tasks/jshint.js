'use strict';

function getJshintTask(options, gulp, mode) {

  function jshintTask() {

    var jshint = require('gulp-jshint');
    var jshintLogger = require('gulp-zkflow-logger')('jshint');
    var _ = require('lodash');

    _.extend(mode, options.mode);

    function jshintStream() {

      return gulp
        .src(options.globs)
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')))
        .pipe(jshint.reporter('fail'))
        .on('error', jshintLogger.error);

    }

    if (mode.env !== 'dev') {
      return jshintStream();
    }

    jshintStream();

    gulp.watch(options.globs, jshintStream)
      .on('change', jshintLogger.start);

  }

  return jshintTask;

}

module.exports = {
  getTask: getJshintTask,
  defaultOptions: {
    globs: [
      'gulpfile.js',
      'gulp/**/*.js',
      'src/**/*.js'
    ]
  }
};
