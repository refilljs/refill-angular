'use strict';

function getTemplatesTask(options, gulp, mode) {

  function templatesTask(next) {

    var gulpif = require('gulp-if');
    var templateCache = require('gulp-angular-templatecache');
    var minifyHtml = require('gulp-minify-html');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('templates');
    var nextHandler;
    var runTemplatesPromise;

    function runTemplates() {

      return nextHandler.handle(
        zkutils.promisify(
          gulp
          .src(options.globs)
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
        )
      );

    }

    logger.start();

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    runTemplatesPromise = runTemplates()
      .finally(function() {
        if (mode.watch) {
          gulp.watch(options.globs, function(path) {
            logger.changed(path);
            runTemplatesPromise = runTemplatesPromise.finally(runTemplates);
          });
        }
      });

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
