'use strict';

function getWebserverTask(options, gulp, mode, getOutputDir) {

  function webserverTask(next) {

    var webserver = require('gulp-webserver');

    gulp.src(options.docsGlobs)
      .pipe(webserver(options.docsWebserver))
      .on('end', function() {

        gulp.src(getOutputDir())
          .pipe(webserver({
            livereload: mode.env === 'dev',
            open: true,
            fallback: 'index.html',
            host: options.host
          }))
          .on('end', next);

      });

  }

  return webserverTask;

}

module.exports = {
  getTask: getWebserverTask,
  defaultOptions: {
    host: 'localhost',
    docsGlobs: 'docs/',
    docsWebserver: {
      livereload: {
        enable: true,
        port: 35730
      },
      directoryListing: {
        enable: true,
        path: 'docs/'
      },
      open: true,
      port: 8010
    }
  }
};
