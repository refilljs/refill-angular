'use strict';

function getBeautifyTask(options, gulp, mode) {

  function beautifyTask(next) {

    var jsbeautifier = require('gulp-jsbeautifier');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('beautify');
    var stream;
    var nextHandler;

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: false,
      logger: logger
    });

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
      }));

    if (mode.env === 'dev') {
      stream = stream.pipe(gulp.dest(''));
    }

    nextHandler.handle(zkutils.promisify(stream));

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
