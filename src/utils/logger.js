'use strict';

var gutil = require('gulp-util');
var _ = require('lodash');
var prefix = gutil.colors.green('◥ zkflow');
var prettyHrtime = require('pretty-hrtime');
var startSymbol = gutil.colors.cyan.bold('►');
var stopSymbol = gutil.colors.cyan.bold('▪');
var restartSymbol = gutil.colors.cyan.bold('↻');
var path = require('path');

function formatPath(filePaths) {

  var formattedPaths;

  if (typeof filePaths.path !== 'undefined') {
    filePaths = filePaths.path;
  }

  if (!_.isArray(filePaths)) {
    filePaths = [filePaths];
  }

  formattedPaths = _.map(filePaths, function(filePath) {
    return path.relative(process.cwd(), filePath);
  }).join(', ');

  return gutil.colors.gray(formattedPaths);

}

function logger(name) {

  var startHrtime = process.hrtime();
  name = gutil.colors.cyan.bold(name);
  gutil.log(prefix, name, startSymbol);

  function start(filePaths) {
    startHrtime = process.hrtime();
    gutil.log(prefix, name, restartSymbol, formatPath(filePaths));
  }

  function finished() {
    gutil.log(prefix, name, stopSymbol, gutil.colors.magenta('◷ ' + prettyHrtime(process.hrtime(startHrtime))));
  }

  function error(err) {
    gutil.log(prefix, name, gutil.colors.red.bold('✖ ' + err.message));
    finished();
  }

  return {
    start: start,
    finished: finished,
    error: error
  };

}

module.exports = logger;
