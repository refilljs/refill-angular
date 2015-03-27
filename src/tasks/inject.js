'use strict';

function injectTask(options, gulp, mode) {

  gulp.task('inject', options.dependencies, function() {

    var inject = require('gulp-inject');
    var minifyHtml = require('gulp-minify-html');
    var gulpif = require('gulp-if');
    var watchLog = require('../watchLog');
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
        .pipe(gulp.dest(baseDir));

    }

    if (mode.dev) {
      watchLog('inject', gulp, options.globs, injectStream);
    }

    return injectStream();

  });

}

module.exports = injectTask;
