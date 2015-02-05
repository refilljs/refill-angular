'use strict';

function templatesTask(gulp) {

  var watchLog = require('../watchLog');

  var config = require('../defaults');

  gulp.task('templates', function() {

    var baseDir = config.dev ? 'dev/' : 'dist/';
    var templatesGlob = ['src/**/*.html', '!src/humanLibrary/index.html'];

    function humanLibraryTemplates() {
      return gulp
        .src(templatesGlob)
        .pipe(gulp.dest(baseDir));
    }

    if (config.dev) {
      gulp
        .watch(templatesGlob, humanLibraryTemplates)
        .on('change', watchLog('templates'))
    }

    return humanLibraryTemplates();

  });

}

module.exports = templatesTask;