'use strict';

function testTask(options, gulp, mode) {

  var karma = require('gulp-karma');

  gulp.task('test', options.dependencies, function() {

    var unitTestsFile = 'src/unitTests.js';
    var preprocessors = {};
    var stream;

    preprocessors[unitTestsFile] = ['browserify'];

    stream = gulp.src(unitTestsFile)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: mode.singleRun ? 'run' : 'watch',
        preprocessors: preprocessors
      }));

    if (mode.singleRun) {
      return stream;
    }

  });

}

module.exports = testTask;
