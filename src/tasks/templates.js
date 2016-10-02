'use strict';

var gulpif = require('gulp-if');
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');
var zkutils = require('gulp-zkflow-utils');
var refillWatcher = require('refill-watcher');
var RefillNextHandler = require('refill-next-handler');

function getTemplatesTask(options, gulp, mode) {

  function templatesTask(next) {

    var logger = zkutils.logger('templates');
    var nextHandler;

    function runTemplates() {
      return nextHandler.handle(
        zkutils.promisify(
          gulp
          .src(options.globs, options.globsOptions)
          .pipe(gulpif(mode.env !== 'dev' && !mode.watch, htmlmin(options.htmlmin)))
          .pipe(templateCache(options.templateModuleFileName, options.templateCache))
          .pipe(gulp.dest(options.outputDir))
        )
      );
    }

    nextHandler = new RefillNextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    refillWatcher.watch(runTemplates, mode.watch, options.globs, logger);

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
