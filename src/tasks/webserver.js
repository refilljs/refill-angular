'use strict';

function taskWebserver(gulp) {

  var webserver = require('gulp-webserver');

  var internalOptions = require('../internalOptions');

  gulp.task('webserver', function() {
    gulp.src(internalOptions.dev ? 'dev/' : 'dist/')
      .pipe(webserver({
        livereload: internalOptions.dev,
        directoryListing: false,
        open: true
      }));
  });

};

module.exports = taskWebserver;