'use strict';

function getWebserverTask(options, gulp, mode) {


  function webserverTask() {

    var webserver = require('gulp-webserver');
    var _ = require('lodash');

    _.extend(mode, options.mode);

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
