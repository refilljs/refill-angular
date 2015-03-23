'use strict';

function templatesTask(options, gulp) {

  var watchLog = require('../watchLog');

  var config = require('../internalOptions');

  gulp.task('templates', options.dependencies, function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';
    var templatesGlob = ['src/**/*.html', '!src/index.html'];

    function templates() {
      return gulp
        .src(templatesGlob)
        .pipe(gulp.dest(baseDir));
    }

    if (config.dev) {
      watchLog('templates', gulp, templatesGlob, templates);
    }

    return templates();

  });

}

module.exports = templatesTask;
