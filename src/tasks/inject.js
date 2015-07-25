'use strict';

function getInjectTask(options, gulp, mode) {

  function injectTask() {

    var inject = require('gulp-inject');
    var minifyHtml = require('gulp-minify-html');
    var template = require('gulp-template');
    var gulpif = require('gulp-if');
    var injectLogger = require('gulp-zkflow-logger')('inject');
    var _ = require('lodash');
    var outputDir = require('../getOutputDir')();
    var injectablesGlobs = prefixGlobs(options.injectablesGlobs);
    var headInjectablesGlobs = prefixGlobs(options.headInjectablesGlobs);

    _.extend(mode, options.mode);

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

      if (_.isArray(globs)) {
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
        gulp.src(globs, {
          read: false
        }), {
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

    function injectStream() {

      var stream;

      stream = gulp.src(options.globs)
        .pipe(getInject(injectablesGlobs));

      if (typeof headInjectablesGlobs !== 'undefined') {
        stream = stream.pipe(getInject(headInjectablesGlobs, 'head'));
      }

      return stream
        .pipe(template({
          angularMainModuleName: getAngularMainModuleName()
        }))
        .pipe(gulpif(mode.env !== 'dev', minifyHtml({
          empty: true,
          spare: true,
          quotes: true
        })))
        .pipe(gulp.dest(outputDir))
        .on('end', injectLogger.finished);

    }

    if (mode.watch) {
      gulp.watch(options.globs, injectStream)
        .on('change', injectLogger.start);
    }

    return injectStream();

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
    absolute: true,
    prodAngularMainModuleName: 'app',
    devAngularMainModuleName: 'appDev',
    testAngularMainModuleName: 'appTest'
  }
};
