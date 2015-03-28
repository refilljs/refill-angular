'use strict';

function bowerTask(options, gulp) {

  gulp.task('bower', options.dependencies, function() {

    var bower = require('gulp-bower');
    var bowerLogger = require('../utils/logger')('bower');

    return bower()
      .on('error', bowerLogger.error)
      .on('end', bowerLogger.finished);

  });

}

module.exports = bowerTask;
