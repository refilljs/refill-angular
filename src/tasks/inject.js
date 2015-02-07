'use strict';

function injectTask(gulp) {

  var inject = require('gulp-inject');
  var watchLog = require('../watchLog');

  var config = require('../internalOptions');

  gulp.task('inject', ['js', 'less'], function() {

    var baseDir = config.dev ? 'dev' : 'dist';
    var indexPath = 'src/humanLibrary/index.html';

    function humanLibraryInject() {
      return gulp
        .src(indexPath)
        .pipe(inject(
          gulp.src([
            baseDir + '/humanLibrary/index.js',
            baseDir + '/humanLibrary/index.css'
          ], {
            read: false
          }), {
            ignorePath: '/' + baseDir
          }
        ))
        .pipe(gulp.dest(baseDir + '/'));
    }

    if (config.dev) {
      gulp
        .watch(indexPath, humanLibraryInject)
        .on('change', watchLog('inject'));
    }

    return humanLibraryInject();

  });

}

module.exports = injectTask;