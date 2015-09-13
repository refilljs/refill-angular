'use strict';

function getJsTask(options, gulp, mode) {

  function jsTask(next) {

    var source = require('vinyl-source-stream');
    var browserify = require('browserify');
    var uglify = require('gulp-uglify');
    var rev = require('gulp-rev');
    var gulpif = require('gulp-if');
    var streamify = require('gulp-streamify');
    var zkutils = require('gulp-zkflow-utils');
    var q = require('q');
    var logger = zkutils.logger('js');
    var bundler;
    var watchify;
    var nextHandler;
    var rebundlePromise;

    function getEntries() {

      if (mode.env === 'prod') {
        return options.prodEntries;
      }

      if (mode.env === 'test') {
        return options.testEntries;
      }

      return options.devEntries;

    }

    function rebundle() {

      var deferred = q.defer();

      bundler.bundle()
        .on('error', deferred.reject)
        .pipe(source('index.js'))
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(uglify())))
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(rev())))
        .pipe(gulp.dest(require('../getOutputDir')()))
        .on('end', deferred.resolve);

      return nextHandler.handle(deferred.promise);

    }

    function checkEntries() {

      function checkProdEntries() {
        return nextHandler.handle(
          zkutils.globby(options.prodEntries, 'prod js not found'), {
            ignoreFailures: true,
            handleSuccess: false
          });

      }

      if (mode.env === 'prod') {
        return checkProdEntries();
      }

      return zkutils.globby(getEntries(), mode.env + ' js not found, falling back to prod')
        .catch(function(error) {
          logger.info(error);
          mode.angularMainModuleProdFallback = true;
          return checkProdEntries();
        });

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    checkEntries().then(function() {

      bundler = browserify({
        cache: {},
        packageCache: {},
        fullPaths: true,
        entries: mode.angularMainModuleProdFallback ? options.prodEntries : getEntries(),
        debug: mode.env === 'dev'
      });

      bundler.transform(require('browserify-ngannotate'));

      if (mode.watch) {
        watchify = require('watchify');
        bundler = watchify(bundler);
      }

      rebundlePromise = rebundle()
        .finally(function() {
          if (mode.watch) {
            bundler.on('update', function(path) {
              logger.changed(path);
              rebundlePromise = rebundlePromise.finally(rebundle);
            });
          }
        });

    });

  }

  return jsTask;

}

module.exports = {
  getTask: getJsTask,
  defaultOptions: {
    devEntries: ['./src/dev/index.js'],
    prodEntries: ['./src/index.js'],
    testEntries: ['./src/test/index.js']
  }
};
