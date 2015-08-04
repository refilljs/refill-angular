'use strict';

function getBeautifyTask(options, gulp, mode) {

  function beautifyTask() {

    var jsbeautifier = require('gulp-jsbeautifier');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('beautify');
    var stream;

    logger.start();

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
      .on('error', logger.error);

    if (mode.env === 'dev') {
      return stream
        .pipe(gulp.dest(''))
        .on('end', logger.finished);
    }

    return stream
      .on('end', logger.finished);

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
