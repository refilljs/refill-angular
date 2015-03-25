'use strict';

function beautifyTask(options, gulp, mode) {

  gulp.task('beautify', options.dependencies, function() {

    var jsbeautifier = require('gulp-jsbeautifier');
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
      }));

    if (mode.jsbeautifierVerifyOnly) {
      return stream;
    }

    return stream.pipe(gulp.dest(''));

  });

}

module.exports = beautifyTask;
