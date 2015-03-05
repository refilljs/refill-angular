'use strict';

function templatesTask(gulp) {

  var watchLog = require('../watchLog');

  var config = require('../internalOptions');

  gulp.task('templates', function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';
    var templatesGlob = ['src/**/*.html', '!src/index.html'];

    function humanLibraryTemplates() {
      return gulp
        .src(templatesGlob)
        .pipe(gulp.dest(baseDir));
    }

    if (config.dev) {
      watchLog('templates', gulp, templatesGlob, humanLibraryTemplates);
    }

    return humanLibraryTemplates();

  });

}

module.exports = templatesTask;