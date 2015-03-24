'use strict';

function beautifyTask(options, gulp, mode) {

  var jsbeautifier = require('gulp-jsbeautifier');

  gulp.task('beautify', options.dependencies, function() {

    var jsbeautifyConfig = './.jsbeautifyrc';
    var stream;

    stream = gulp
      .src([
        'src/**/*.js',
        'src/**/*.html',
        'gulp/**/*.js',
        'gulpfile.js',
        'karma.conf.js'
      ], {
        base: './'
      });

    if (mode.jsbeautifierVerifyOnly) {
      return stream.pipe(jsbeautifier({
        mode: 'VERIFY_ONLY',
        config: jsbeautifyConfig
      }));
    }

    return stream
      .pipe(jsbeautifier({
        mode: 'VERIFY_AND_WRITE',
        config: jsbeautifyConfig
      }))
      .pipe(gulp.dest(''));

  });

}

module.exports = beautifyTask;
