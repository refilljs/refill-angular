'use strict';

var gutil = require('gulp-util');

module.exports = function(name) {

  return function(error) {
    gutil.log(name, 'error', gutil.colors.red(error.message));
  };

};
