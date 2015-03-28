'use strict';

function injectTask(options, gulp, mode) {

  gulp.task('inject', options.dependencies, function() {

    var inject = require('gulp-inject');
    var minifyHtml = require('gulp-minify-html');
    var gulpif = require('gulp-if');
    var injectLogger = require('../utils/logger')('inject');
    var _ = require('lodash');
    var baseDir = mode.dev ? 'dev/' : 'dist/';
    var injectablesGlobs = prefixGlobs(options.injectablesGlobs);
    var headInjectablesGlobs = prefixGlobs(options.headInjectablesGlobs);

    function prefixGlobs(globs) {

      var prefixedGlobs;

      if (typeof globs === 'undefined') {
        return;
      }

      if (_.isArray(globs)) {
        prefixedGlobs = [];
        globs.forEach(function(glob) {
          prefixedGlobs.push(baseDir + glob);
        });
        return prefixedGlobs;
      }

      return baseDir + globs;

    }

    function getInject(globs, name) {
      return inject(
        gulp.src(globs, {
          read: false
        }), {
          addRootSlash: options.absolute,
          ignorePath: baseDir,
          name: name
        }
      );
    }

    function injectStream() {

      var stream;

      stream = gulp.src(options.globs)
        .pipe(getInject(injectablesGlobs));

      if (typeof headInjectablesGlobs !== 'undefined') {
        stream = stream.pipe(getInject(headInjectablesGlobs, 'head'));
      }

      return stream.pipe(gulpif(!mode.dev, minifyHtml({
          empty: true,
          spare: true,
          quotes: true
        })))
        .pipe(gulp.dest(baseDir))
        .on('end', injectLogger.finished);

    }

    if (mode.dev) {
      gulp.watch(options.globs, injectStream)
        .on('change', injectLogger.start);
    }

    return injectStream();

  });

}

module.exports = injectTask;
