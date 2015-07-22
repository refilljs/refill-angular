'use strict';

function getBeautifyTask(options, gulp, mode) {

  function beautifyTask() {

    var jsbeautifier = require('gulp-jsbeautifier');
    var beautifyLogger = require('gulp-zkflow-logger')('beautify');
    var stream;
    var _ = require('lodash');

    _.extend(mode, options.mode);

    stream = gulp
      .src(options.globs, {
        base: './'
      })
      .pipe(jsbeautifier({
        mode: mode.env === 'dev' ? 'VERIFY_AND_WRITE' : 'VERIFY_ONLY',
        logSuccess: false,
        js: {
          indentSize: '2',
          endWithNewline: true
        },
        css: {
          indentSize: '2',
          endWithNewline: true
        },
        html: {
          indentSize: '2',
          endWithNewline: true
        }
      }))
      .on('error', beautifyLogger.error);

    if (mode.env === 'dev') {
      return stream
        .pipe(gulp.dest(''))
        .on('end', beautifyLogger.finished);
    }

    return stream
      .on('end', beautifyLogger.finished);

  }

  return beautifyTask;

}

module.exports = {
  getTask: getBeautifyTask,
  defaultOptions: {
    globs: [
      'src/**/*.js',
      'src/**/*.html',
      'gulp/**/*.js',
      'gulpfile.js'
    ]
  }
};
