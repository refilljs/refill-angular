'use strict';

function beautifyTask(options, gulp, mode) {

  gulp.task('beautify', options.dependencies, function() {

    var jsbeautifier = require('gulp-jsbeautifier');
    var beautifyLogger = require('../utils/logger')('beautify');
    var stream;

    stream = gulp
      .src(options.globs, {
        base: './'
      })
      .pipe(jsbeautifier({
        mode: mode.jsbeautifierVerifyOnly ? 'VERIFY_ONLY' : 'VERIFY_AND_WRITE',
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

    if (mode.jsbeautifierVerifyOnly) {
      return stream
        .on('end', beautifyLogger.finished);
    }

    return stream
      .pipe(gulp.dest(''))
      .on('end', beautifyLogger.finished);

  });

}

module.exports = beautifyTask;
