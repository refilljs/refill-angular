'use strict';

function testTask(gulp) {

  var karma = require('gulp-karma');

  var internalOptions = require('../internalOptions');

  gulp.task('test', ['bower'], function() {

    var unitTestsFile = 'src/humanLibrary/unitTests.js';
    var preprocessors = {};
    var stream;

    preprocessors[unitTestsFile] = ['browserify'];

    stream = gulp.src(unitTestsFile)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: internalOptions.singleRun ? 'run' : 'watch',
        preprocessors: preprocessors
      }));

    if (internalOptions.singleRun) {
      return stream
    }

  });

}

module.exports = testTask;