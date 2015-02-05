'use strict';

function gulpZkflow(gulp) {
  require('./tasks/assets')(gulp);
  require('./tasks/beautify')(gulp);
  require('./tasks/bower')(gulp);
  require('./tasks/build')(gulp);
  require('./tasks/ci')(gulp);
  require('./tasks/clean')(gulp);
  require('./tasks/default')(gulp);
  require('./tasks/inject')(gulp);
  require('./tasks/js')(gulp);
  require('./tasks/less')(gulp);
  require('./tasks/templates')(gulp);
  require('./tasks/test')(gulp);
  require('./tasks/webserver-dev')(gulp);
  require('./tasks/webserver-dist')(gulp);
}

gulpZkflow.bind(null, require('gulp'));

gulpZkflow.use = function(gulp) {
  return gulpZkflow.bind(null, gulp);
};

module.exports = gulpZkflow;