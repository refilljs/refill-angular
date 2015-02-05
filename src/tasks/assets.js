'use strict';

function assetsTask(gulp) {

  var config = require('../defaults');

  gulp.task('assets', function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';

    return gulp
      .src([
        'src/assets/fonts/**',
        'src/assets/pictures/**'
      ], {
        base: 'src/'
      })
      .pipe(gulp.dest(baseDir + 'humanLibrary/'));

  });

  gulp.task('glyphiconfont', ['bower'], function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';

    return gulp
      .src('bower_components/bootstrap/fonts/**')
      .pipe(gulp.dest(baseDir + 'fonts/'));

  });

}

module.exports = assetsTask;