'use strict';

var gutil = require('gulp-util');

module.exports = function(name, gulp, glob, pipe) {

  return gulp
    .watch(glob, function() {
      pipe().on('end', function() {
        gutil.log('Finished', gutil.colors.cyan(name));
      });
    })
    .on('change', function(event) {
      gutil.log('Starting', gutil.colors.cyan(name), 'file', event.path, 'changed');
    })
};
