'use strict';

function getGulp(externalGulp) {

  if (typeof externalGulp === 'undefined') {
    return require('gulp');
  }

  return externalGulp;

}

function gulpZkflowAngular(options, externalGulp) {

  var gulp = getGulp(externalGulp);

  require('./tasks/assets')(gulp, options);
  require('./tasks/beautify')(gulp, options);
  require('./tasks/bower')(gulp, options);
  require('./tasks/build')(gulp, options);
  require('./tasks/ci')(gulp, options);
  require('./tasks/clean')(gulp, options);
  require('./tasks/default')(gulp, options);
  require('./tasks/inject')(gulp, options);
  require('./tasks/js')(gulp, options);
  require('./tasks/css')(gulp, options);
  require('./tasks/templates')(gulp, options);
  require('./tasks/test')(gulp, options);
  require('./tasks/webserver')(gulp, options);

}

module.exports = gulpZkflowAngular;
