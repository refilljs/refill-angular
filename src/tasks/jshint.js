'use strict';

function jshintTask(options, gulp, mode) {

  gulp.task('jshint', options.dependencies, function() {

    var jshint = require('gulp-jshint');
    var watchLog = require('../watchLog');

    function jshintStream() {

      var stream = gulp
        .src(options.globs)
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')));

      if (true === mode.jshintFailOnError) {
        stream = stream.pipe(jshint.reporter('fail'));
      }

      return stream;

    }

    if (false === mode.dev) {
      return jshintStream();
    }

    jshintStream();
    watchLog('jshint', gulp, options.globs, jshintStream);

  });

}

module.exports = jshintTask;
