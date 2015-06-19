'use strict';

/**
 * @module gulp-zkflow-angular
 */

/**
 * get gulp object from external source if available or from require
 * @private
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
 * Set up zkflow angular tasks.
 *
 * Available tasks:
 * Basic: default, build, ci, beautify
 *
 * @param {object} [options] Contains configuration of all zkflow angular tasks
 *
 * @param {object} [options.assets] Configuration of assets task
 * @param {boolean} [options.assets.enabled=true]
 * If task is enabled you will be able to use it by gulp assets command.
 * Disabling it won't delete it from other tasks dependencies.
 * @param {array|undefined|null} [options.assets.dependencies]
 * Dependencies for this task in form of array of strings e.g. ['someTask', 'someOtherTask'].
 * @param {string|array} [options.assets.globs='src\/**\/_assets\/**\/*']
 *
 * @param {gulp} [externalGulp=require('gulp')]
 *
 *
 * @returns {object} mode - Mode object.
 * It allows to set different modes of tasks operation
 *
 * @alias module:gulp-zkflow-angular
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
        ['beautify', 'build', 'test', 'jshint']
      ]
    },
    css: {
      task: require('./tasks/css'),
      dependencies: ['bower']
    },
    default: {
      task: require('./tasks/sequenceDev'),
      sequence: [
        ['build', 'jshint', 'test'],
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
