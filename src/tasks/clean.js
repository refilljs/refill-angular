'use strict';

function cleanTask(options, gulp, mode) {

  var del = require('del');

  gulp.task('clean', options.dependencies, function(done) {

    var baseDir = mode.dev ? 'dev/**' : 'dist/**';

    del(baseDir, done);

  });

}

module.exports = cleanTask;
