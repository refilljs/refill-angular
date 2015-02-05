'use strict';

function taskWebserverDist(gulp) {

  var webserver = require('gulp-webserver');

  gulp.task('webserver-dist', function() {
    gulp.src('dist/')
      .pipe(webserver({
        directoryListing: false,
        open: true
      }));
  });

};

module.exports = taskWebserverDist;