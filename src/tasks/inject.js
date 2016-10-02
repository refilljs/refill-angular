'use strict';

var inject = require('gulp-inject');
var htmlmin = require('gulp-htmlmin');
var template = require('gulp-template');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var refillWatcher = require('refill-watcher');
var refillLogger = require('refill-logger');
var refillGlobby = require('refill-globby');
var RefillNextHandler = require('refill-next-handler');

function getInjectTask(options, gulp, mode, getOutputDir) {

  function injectTask(next) {

    var outputDir = getOutputDir();
    var logger = refillLogger('inject');
    var injectablesGlobs = prefixGlobs(options.injectablesGlobs);
    var headInjectablesGlobs = prefixGlobs(options.headInjectablesGlobs);
    var nextHandler;

    var noInjectFilesMessage =
      '\nNo inject files found.\n\n' +
      'Your inject files are determined by globs\n' +
      options.globs.toString() + '\n\n' +
      'You can add some matching files with inject.\n' +
      'See README.md for example file\n';

    function addBaseDir(glob) {
      if (glob.charAt(0) === '!') {
        return '!' + outputDir + glob.slice(1);
      }
      return outputDir + glob;
    }

    function prefixGlobs(globs) {

      var prefixedGlobs;

      if (typeof globs === 'undefined') {
        return;
      }

      if (Array.isArray(globs)) {
        prefixedGlobs = [];
        globs.forEach(function(glob) {
          prefixedGlobs.push(addBaseDir(glob));
        });
        return prefixedGlobs;
      }

      return outputDir + globs;

    }

    function getInject(globs, name) {
      return inject(
        gulp.src(globs, options.headInjectablesGlobs), {
          addRootSlash: options.absolute,
          ignorePath: outputDir,
          name: name
        }
      );
    }

    function getAngularMainModuleName() {

      if (mode.env === 'prod') {
        return options.prodAngularMainModuleName;
      }

      if (mode.env === 'test') {
        return options.testAngularMainModuleName;
      }

      return options.devAngularMainModuleName;

    }

    function runInject() {

      return nextHandler.handle(
        refillGlobby(options.globs, noInjectFilesMessage), {
          ignoreFailures: true,
          handleSuccess: false
        })
        .then(function() {

          return nextHandler.handle(new Promise(function (resolve, reject) {

            var stream;

            stream = gulp.src(options.globs, options.globsOptions)
              .pipe(plumber(reject))
              .pipe(getInject(injectablesGlobs));

            if (typeof headInjectablesGlobs !== 'undefined') {
              stream = stream.pipe(getInject(headInjectablesGlobs, 'head'));
            }

            stream
              .pipe(template({
                angularMainModuleName: mode.angularMainModuleProdFallback ? options.prodAngularMainModuleName : getAngularMainModuleName()
              }))
              .pipe(gulpif(mode.env !== 'dev', htmlmin(options.htmlmin)))
              .pipe(gulp.dest(outputDir))
              .on('end', resolve);

          }));

        });

    }

    nextHandler = new RefillNextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    refillWatcher.watch(runInject, mode.watch, options.globs, logger);

  }

  return injectTask;

}

module.exports = {
  getTask: getInjectTask,
  defaultOptions: {
    globs: 'src/index.html',
    injectablesGlobs: [
      'index*.js',
      'index*.css'
    ],
    injectablesGlobsOptions: {
      read: false
    },
    absolute: true,
    prodAngularMainModuleName: 'app',
    devAngularMainModuleName: 'appDev',
    testAngularMainModuleName: 'appTest'
  }
};
