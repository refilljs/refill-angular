'use strict';

function cssTask(gulp) {

  gulp.task('css', ['bower'], function(doneCallback) {

    var lessPipe = require('../pipes/less');
    var watchLog = require('../watchLog');
    var config = require('../internalOptions');
    var baseDir = config.dev ? 'dev/' : 'dist/';
    var done = false;

    lessPipe = config.dev ? lessPipe.dev : lessPipe.dist;

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

    if (config.dev) {
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
