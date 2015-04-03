'use strict';

function templatesTask(options, gulp, mode) {

  gulp.task('templates', options.dependencies, function() {

    var gulpif = require('gulp-if');
    var templateCache = require('gulp-angular-templatecache');
    var minifyHtml = require('gulp-minify-html');
    var templatesLogger = require('../utils/logger')('templates');

    function templatesStream() {
      return gulp.src(options.globs)
        .pipe(gulpif(!mode.dev, minifyHtml({
          empty: true,
          spare: true,
          quotes: true
        })))
        .pipe(templateCache('templates.js', {
          standalone: true,
          module: options.angularModuleName,
          root: '/',
          templateHeader: 'module.exports = angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {'
        }))
        .pipe(gulp.dest('.tmp/'))
        .on('end', templatesLogger.finished);
    }

    if (mode.dev) {
      gulp.watch(options.globs, templatesStream)
        .on('change', templatesLogger.start);
    }

    return templatesStream();

  });

}

module.exports = templatesTask;
