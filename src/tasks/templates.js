'use strict';

function getTemplatesTask(options, gulp, mode) {

  function templatesTask(next) {

    var gulpif = require('gulp-if');
    var templateCache = require('gulp-angular-templatecache');
    var minifyHtml = require('gulp-minify-html');
    var zkutils = require('gulp-zkflow-utils');
    var watch = require('gulp-watch');
    var logger = zkutils.logger('templates');
    var nextHandler;
    var runTemplatesPromise;

    function runTemplates() {

      return nextHandler.handle(
        zkutils.promisify(
          gulp
          .src(options.globs)
          .pipe(gulpif(mode.env !== 'dev' && !mode.watch, minifyHtml(options.minifyHtml)))
          .pipe(templateCache(options.templateModuleFileName, options.templateCache))
          .pipe(gulp.dest(options.outputDir))
        )
      );

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    runTemplatesPromise = runTemplates()
      .finally(function() {
        if (mode.watch) {
          watch(options.globs, function(path) {
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
    globs: [
      'src/**/_templates/*.html',
      'src/**/_templates/**/*.html'
    ],
    minifyHtml: {
      empty: true,
      spare: true,
      quotes: true
    },
    templateCache: {
      standalone: true,
      module: 'zk.templates',
      root: '/',
      moduleSystem: 'browserify',
      templateFooter: '}]).name;'
    },
    templateModuleFileName: 'templates.js',
    outputDir: '.tmp/'
  }
};
