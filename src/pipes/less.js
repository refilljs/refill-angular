'use strict';

var less = require('gulp-less');
var csso = require('gulp-csso');
var errorLog = require('../errorLog');

function lessBasePipe(gulp) {
  return gulp
    .src('src/humanLibrary/index.less')
    .pipe(less())
    .on('error', errorLog('Less'))
}

function lessDevPipe(gulp) {
  return lessBasePipe(gulp);
}

function lessDistPipe(gulp) {
  return lessBasePipe(gulp)
    .on('error', function() {
      process.exit(1);
    })
    .pipe(csso());
}

module.exports = {
  dev: lessDevPipe,
  dist: lessDistPipe
};