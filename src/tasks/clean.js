'use strict';

function cleanTask(gulp) {

  var del = require('del');

  var config = require('../internalOptions');

  gulp.task('clean', function(done) {

    var baseDir = config.dev ? 'dev/**' : 'dist/**';

    del(baseDir, done);

  });

}

module.exports = cleanTask;