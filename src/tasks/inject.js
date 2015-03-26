'use strict';

function injectTask(options, gulp, mode) {

  var inject = require('gulp-inject');
  var watchLog = require('../watchLog');

  gulp.task('inject', options.dependencies, function() {

    var baseDir = mode.dev ? 'dev' : 'dist';
    var indexPath = 'src/index.html';

    function injectStream() {
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

    if (mode.dev) {
      watchLog('inject', gulp, indexPath, injectStream);
    }

    return injectStream();

  });

}

module.exports = injectTask;
