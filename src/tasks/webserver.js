'use strict';

function getWebserverTask(options, gulp, mode) {


  function webserverTask() {

    var webserver = require('gulp-webserver');

    gulp.src(require('../getOutputDir')())
      .pipe(webserver({
        livereload: mode.env === 'dev',
        directoryListing: false,
        open: true,
        fallback: 'index.html',
        host: options.host
      }));
  }

  return webserverTask;

}

module.exports = {
  getTask: getWebserverTask,
  defaultOptions: {
    host: 'localhost'
  }
};
