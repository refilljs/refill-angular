'use strict';

function cleanTask(options, gulp) {

  var del = require('del');

  var config = require('../internalOptions');

  gulp.task('clean', options.dependencies, function(done) {

    var baseDir = config.dev ? 'dev/**' : 'dist/**';

    del(baseDir, done);

  });

}

module.exports = cleanTask;
