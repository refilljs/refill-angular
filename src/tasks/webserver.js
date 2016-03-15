'use strict';

function getWebserverTask(options, gulp, mode, getOutputDir) {

  function webserverTask() {

    var webserver = require('gulp-webserver');

    return gulp.src(getOutputDir())
      .pipe(webserver({
        livereload: mode.env === 'dev',
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
