'use strict';

function assetsTask(options, gulp) {

  var config = require('../internalOptions');

  gulp.task('assets', options.dependencies, function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';

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
