'use strict';

function gulpZkflow(gulp, options) {
  
  options = {};
  
  require('./tasks/assets')(gulp, options);
  require('./tasks/beautify')(gulp, options);
  require('./tasks/bower')(gulp, options);
  require('./tasks/build')(gulp, options);
  require('./tasks/ci')(gulp, options);
  require('./tasks/clean')(gulp, options);
  require('./tasks/default')(gulp, options);
  require('./tasks/inject')(gulp, options);
  require('./tasks/js')(gulp, options);
  require('./tasks/css')(gulp, options);
  require('./tasks/templates')(gulp, options);
  require('./tasks/test')(gulp, options);
  require('./tasks/webserver')(gulp, options);

}

gulpZkflow.bind(null, require('gulp'));

gulpZkflow.use = function(gulp) {
  return gulpZkflow.bind(null, gulp);
};

module.exports = gulpZkflow;