'use strict';

function bowerTask(options, gulp) {

  var bower = require('gulp-bower');

  gulp.task('bower', options.dependencies, function() {
    return bower();
  });

}

module.exports = bowerTask;
