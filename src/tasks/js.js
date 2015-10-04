'use strict';

function getJsTask(options, gulp, mode, getOutputDir) {

  function jsTask(next) {

    var source = require('vinyl-source-stream');
    var browserify = require('browserify');
    var uglify = require('gulp-uglify');
    var rev = require('gulp-rev');
    var gulpif = require('gulp-if');
    var streamify = require('gulp-streamify');
    var zkutils = require('gulp-zkflow-utils');
    var watch = require('gulp-watch');
    var q = require('q');
    var logger = zkutils.logger('js');
    var bundler;
    var watchify;
    var nextHandler;
    var rebundlePromise;

    var noEnvJsFilesMessage =
      '\nNo ' + mode.env + ' js entry files found,\n' +
      'falling back to prod.\n\n' +
      'Your ' + mode.env + ' js entry files are determined by globs\n' +
      getEntries().toString() + '\n\n' +
      'You can add some environment specific js to handle mocks.\n' +
      'Learn more about AngularJS mocks:\n' +
      'https://code.angularjs.org/1.4.7/docs/api/ngMockE2E\n';

    var noJsFilesMessage =
      '\nNo js entry files found.\n\n' +
      'Your js entry files are determined by globs\n' +
      options.prodEntries.toString() + '\n\n' +
      'You can add some matching files with JavaScript.\n' +
      'Learn more about ZKFlow JavaScript toolstack:\n' +
      'https://angularjs.org/\n' +
      'http://browserify.org/\n' +
      'https://github.com/omsmith/browserify-ngannotate\n';

    function getEntries() {

      if (mode.angularMainModuleProdFallback || mode.env === 'prod') {
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
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(uglify(options.uglify))))
        .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(rev())))
        .pipe(gulp.dest(getOutputDir()))
        .on('end', deferred.resolve);

      return nextHandler.handle(deferred.promise);

    }

    function checkEntries() {

      function checkProdEntries() {
        return nextHandler.handle(
          zkutils.globby(options.prodEntries, noJsFilesMessage), {
            ignoreFailures: true,
            handleSuccess: false
          });
      }

      if (mode.env === 'prod') {
        return checkProdEntries();
      }

      return zkutils.globby(getEntries(), noEnvJsFilesMessage)
        .catch(function(error) {
          logger.info(error);
          mode.angularMainModuleProdFallback = true;
          return checkProdEntries();
        });

    }

    function runJs() {

      bundler = browserify({
        cache: {},
        packageCache: {},
        fullPaths: true,
        entries: getEntries(),
        debug: mode.env === 'dev'
      });

      bundler.transform(require('browserify-ngannotate'));

      if (mode.watch) {
        watchify = require('watchify');
        bundler = watchify(bundler);
      }

      rebundlePromise = rebundle()
        .finally(function() {
          if (!mode.watch) {
            return;
          }
          bundler.on('update', function(path) {
            logger.changed(path);
            rebundlePromise = rebundlePromise.finally(rebundle);
          });
        });

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    checkEntries()
      .then(runJs)
      .finally(function() {
        if (!mode.watch) {
          return;
        }
        watch(
            getEntries(), {
              events: ['add', 'unlink']
            })
          .on('add', function(event) {
            logger.changed(event);
            runJs();
          })
          .on('unlink', function(event) {
            logger.changed(event);
            bundler.close();
            logger.finished();
          });
      });

  }

  return jsTask;

}

module.exports = {
  getTask: getJsTask,
  defaultOptions: {
    devEntries: 'src/dev/index.js',
    prodEntries: 'src/index.js',
    testEntries: 'src/test/index.js'
  }
};
