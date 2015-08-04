'use strict';

function getTemplatesTask(options, gulp, mode) {

  function templatesTask() {

    var gulpif = require('gulp-if');
    var templateCache = require('gulp-angular-templatecache');
    var minifyHtml = require('gulp-minify-html');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('templates');

    logger.start();

    function templatesStream() {
      return gulp.src(options.globs)
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, minifyHtml({
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
        .on('end', logger.finished);
    }

    if (mode.watch) {
      gulp.watch(options.globs, templatesStream)
        .on('change', logger.changed);
    }

    return templatesStream();

  }

  return templatesTask;

}

module.exports = {
  getTask: getTemplatesTask,
  defaultOptions: {
    globs: 'src/**/_templates/**/*.html',
    angularModuleName: 'zk.templates'
  }
};
