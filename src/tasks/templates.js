'use strict';

function templatesTask(options, gulp, mode) {

  var watchLog = require('../watchLog');

  gulp.task('templates', options.dependencies, function() {

    var baseDir = mode.dev ? 'dev/' : 'dist/';
    var templatesGlob = ['src/**/*.html', '!src/index.html'];

    function templates() {
      return gulp
        .src(templatesGlob)
        .pipe(gulp.dest(baseDir));
    }

    if (mode.dev) {
      watchLog('templates', gulp, templatesGlob, templates);
    }

    return templates();

  });

}

module.exports = templatesTask;
