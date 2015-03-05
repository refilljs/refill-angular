'use strict';

var less = require('gulp-less');
var csso = require('gulp-csso');
var streamify = require('gulp-streamify');
var rev = require('gulp-rev');
var errorLog = require('../errorLog');

function lessBasePipe(gulp) {
  return gulp
    .src('src/index.less')
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
    .pipe(csso())
    .pipe(streamify(rev()));
}

module.exports = {
  dev: lessDevPipe,
  dist: lessDistPipe
};