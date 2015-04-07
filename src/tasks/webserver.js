'use strict';

function getTaskWebserver(options, gulp, mode) {

  var webserver = require('gulp-webserver');

  gulp.task('webserver', options.dependencies, function() {
    gulp.src(mode.dev ? 'dev/' : 'dist/')
      .pipe(webserver({
        livereload: mode.dev,
        directoryListing: false,
        open: true,
        fallback: 'index.html',
        host: options.host
      }));
  });

}

module.exports = {
  getTask: getTaskWebserver,
  defaultOptions: {
    host: 'localhost'
  }
};
