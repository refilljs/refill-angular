'use strict';

function assetsTask(gulp) {

  var config = require('../internalOptions');

  gulp.task('assets', function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';

    return gulp
      .src([
        'src/**/_assets/**'
      ], {
        base: 'src/'
      })
      .pipe(gulp.dest(baseDir));

  });

  gulp.task('glyphiconfont', ['bower'], function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';

    return gulp
      .src('bower_components/bootstrap/fonts/**')
      .pipe(gulp.dest(baseDir + '_assets/bootstrap/fonts/'));

  });

}

module.exports = assetsTask;