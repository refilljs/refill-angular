'use strict';

function injectTask(gulp) {

  var inject = require('gulp-inject');
  var watchLog = require('../watchLog');

  var config = require('../internalOptions');

  gulp.task('inject', ['js', 'css'], function() {

    var baseDir = config.dev ? 'dev' : 'dist';
    var indexPath = 'src/index.html';

    function humanLibraryInject() {
      return gulp
        .src(indexPath)
        .pipe(inject(
          gulp.src([
            baseDir + '/index*.js',
            baseDir + '/index*.css'
          ], {
            read: false
          }), {
            addRootSlash: false,
            ignorePath: baseDir
          }
        ))
        .pipe(gulp.dest(baseDir + '/'));
    }

    if (config.dev) {
      watchLog('inject', gulp, indexPath, humanLibraryInject);
    }

    return humanLibraryInject();

  });

}

module.exports = injectTask;
