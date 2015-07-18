'use strict';

function getOutputDir() {

  var mode = require('./mode');

  if (mode.env === 'prod') {
    return 'dist/';
  }

  if (mode.env === 'test') {
    return 'test/';
  }

  return 'dev/';

}

module.exports = getOutputDir;