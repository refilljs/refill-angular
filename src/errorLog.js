'use strict';

var gutil = require('gulp-util');
var config = require('./internalOptions');
var notify = require('gulp-notify');

module.exports = function(name) {

  if (config.dev) {
    return notify.onError(name + ' error: <%= error.message %>');
  }

  return function(error) {
    gutil.log(gutil.colors.red(name), gutil.colors.red('error:'), error.message);
  }

};
