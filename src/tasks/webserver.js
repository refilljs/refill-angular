'use strict';

function taskWebserver(options, gulp, mode) {

  var webserver = require('gulp-webserver');

  gulp.task('webserver', options.dependencies, function() {
    gulp.src(mode.dev ? 'dev/' : 'dist/')
      .pipe(webserver({
        livereload: mode.dev,
        directoryListing: false,
        open: true,
        fallback: 'index.html'
      }));
  });

}

module.exports = taskWebserver;
