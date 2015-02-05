'use strict';

function bowerTask(gulp) {

  var bower = require('gulp-bower');

  gulp.task('bower', function() {
    return bower();
  });

}

module.exports = bowerTask;