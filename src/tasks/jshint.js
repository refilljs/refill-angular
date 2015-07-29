'use strict';

function getJshintTask(options, gulp, mode) {

  function jshintTask() {

    var jshint = require('gulp-jshint');
    var jshintLogger = require('gulp-zkflow-logger')('jshint');
    var _ = require('lodash');
    var stream;
    var jshintDefaultOptions = {
      lookup: false,
      strict: true,
      unused: true,
      undef: true,
      eqeqeq: true,
      browserify: true,
      jasmine: true
    };

    _.extend(mode, options.mode);

    function jshintStream() {

      return gulp
        .src(options.globs)
        .pipe(jshint(options.jshintrc ? undefined : jshintDefaultOptions))
        .pipe(jshint.reporter(require('jshint-stylish')))
        .pipe(jshint.reporter('fail'))
        .on('error', jshintLogger.error);

    }

    stream = jshintStream();

    if (!mode.watch) {
      return stream;
    }

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
    ],
    jshintrc: false
  }
};
