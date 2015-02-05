'use strict';

var gutil = require('gulp-util');

module.exports = function(name) {
  return function(event) {
    gutil.log(gutil.colors.magenta(name), 'detected file', event.path, 'have changed, starting...');
  }
};
