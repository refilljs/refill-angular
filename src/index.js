'use strict';

/**
 * get gulp object from external source if available or from require
 * @param externalGulp
 * @return {*} - gulp object
 */
function getGulp(externalGulp) {

  if (typeof externalGulp === 'undefined') {
    return require('gulp');
  }

  return externalGulp;

}

/**
 * Set zkflow angular tasks
 * @param options
 * @param externalGulp
 */
function gulpZkflowAngular(options, externalGulp) {

  var loadTasks = require('gulp-zkflow-load-tasks');
  var argv = require('yargs')
    .boolean('dist')
    .argv;

  var mode = {
    dev: !argv.dist
  };

  loadTasks(mode, options, getGulp(externalGulp), {
    assets: require('./tasks/assets'),
    beautify: require('./tasks/beautify'),
    bower: require('./tasks/bower'),
    clean: require('./tasks/clean'),
    jshint: require('./tasks/jshint'),
    templates: require('./tasks/templates'),
    webserver: require('./tasks/webserver'),
    build: {
      task: require('./tasks/sequenceDist'),
      sequence: [
        'clean', ['inject', 'assets']
      ]
    },
    ci: {
      task: require('./tasks/sequenceDist'),
      sequence: [
        'clean', ['beautify', 'build', 'test', 'jshint']
      ]
    },
    css: {
      task: require('./tasks/css'),
      dependencies: ['bower']
    },
    default: {
      task: require('./tasks/sequenceDev'),
      sequence: [
        'clean', ['inject', 'assets', 'jshint', 'test'],
        'webserver'
      ]
    },
    inject: {
      task: require('./tasks/inject'),
      dependencies: ['js', 'css']
    },
    js: {
      task: require('./tasks/js'),
      enabled: true,
      dependencies: ['bower', 'templates']
    },
    test: {
      task: require('./tasks/test'),
      dependencies: ['bower', 'templates']
    }
  });

  return mode;

}

module.exports = gulpZkflowAngular;
