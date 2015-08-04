'use strict';

function getJshintTask(options, gulp, mode) {

  function jshintTask() {

    var jshint = require('gulp-jshint');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('jshint');
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

    logger.start();

    function jshintStream() {

      return gulp
        .src(options.globs)
        .pipe(jshint(options.jshintrc ? undefined : jshintDefaultOptions))
        .pipe(jshint.reporter(require('jshint-stylish')))
        .pipe(jshint.reporter('fail'))
        .on('error', logger.error);

    }

    stream = jshintStream();

    if (!mode.watch) {
      return stream;
    }

    gulp.watch(options.globs, jshintStream)
      .on('change', logger.changed);

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
