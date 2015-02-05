'use strict';

function testTask(gulp) {

  var karma = require('gulp-karma');

  var config = require('../defaults');

  gulp.task('test', ['bower'], function(done) {

    var unitTestsFile = 'src/humanLibrary/unitTests.js';
    var preprocessors = {};
    preprocessors[unitTestsFile] = ['browserify'];

    return gulp.src(unitTestsFile)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: config.singleRun ? 'run' : 'watch',
        preprocessors: preprocessors
      }));

  });

}

module.exports = testTask;