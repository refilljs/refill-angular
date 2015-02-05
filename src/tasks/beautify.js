'use strict';

function beautifyTask(gulp) {

  var jsbeautifier = require('gulp-jsbeautifier');

  var config = require('../defaults');

  gulp.task('jsbeautifier', function() {

    var jsbeautifyConfig = './.jsbeautifyrc';
    var stream;

    stream = gulp
      .src([
        'src/**/*.js',
        'src/**/*.html',
        'gulp/**/*.js',
        'gulpfile.js',
        'karma.conf.js',
        '!src/assets/vendor/bower_components/**'
      ], {
        base: './'
      });

    if (config.jsbeautifierVerifyOnly) {
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