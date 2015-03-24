'use strict';

function cssTask(options, gulp, mode) {

  gulp.task('css', options.dependencies, function(doneCallback) {

    var lessPipe = require('../pipes/less');
    var watchLog = require('../watchLog');
    var baseDir = mode.dev ? 'dev/' : 'dist/';
    var done = false;

    lessPipe = mode.dev ? lessPipe.dev : lessPipe.dist;

    function cssPipe() {
      return lessPipe(gulp, done)
        .pipe(gulp.dest(baseDir))
        .on('end', function() {
          if (done) {
            return;
          }
          done = true;
          doneCallback();
        });
    }

    if (mode.dev) {
      watchLog('css', gulp, [
          'src/**/*.less',
          'src/**/*.css'
        ],
        cssPipe);
    }

    cssPipe();

  });

}

module.exports = cssTask;
