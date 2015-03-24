'use strict';

function assetsTask(options, gulp, mode) {

  gulp.task('assets', options.dependencies, function() {

    var baseDir = mode.dev ? 'dev/' : 'dist/';

    return gulp
      .src([
        'src/**/_assets/**'
      ], {
        base: 'src/'
      })
      .pipe(gulp.dest(baseDir));

  });

}

module.exports = assetsTask;
