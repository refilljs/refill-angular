'use strict';

var zkflowNode = require('zkflow-node');

zkflowNode.init({
  'lint-js': {
    globs: [
      'gulpfile.js',
      'src/*.js',
      'src/**/*.js',
      'e2e/mini/gulpfile.js',
      'e2e/maxi/gulpfile.js',
      'e2e/maxi/src/*.js',
      'e2e/maxi/src/**/*.js',
      'e2e/maxi/e2e/*.js',
      'e2e/maxi/e2e/**/*.js'
    ]
  }
}, require('gulp'));
