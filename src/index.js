'use strict';

/**
 * @module gulp-zkflow-angular
 */

var loadTasks = require('gulp-zkflow-load-tasks');
var mode = require('./mode');

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
 * @alias module:gulp-zkflow-angular.init
 */
function init(options, externalGulp) {


  loadTasks(mode, options, getGulp(externalGulp), {
    assets: require('./tasks/assets'),
    beautify: require('./tasks/beautify'),
    bower: require('./tasks/bower'),
    clean: require('./tasks/clean'),
    jshint: require('./tasks/jshint'),
    templates: require('./tasks/templates'),
    webserver: require('./tasks/webserver'),
    build: {
      task: require('./tasks/sequenceProd'),
      sequence: [
        'clean', ['inject', 'assets']
      ]
    },
    ci: {
      task: require('./tasks/sequenceProd'),
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
        'clean', ['inject', 'assets', 'jshint', 'test'],
        'webserver'
      ]
    },
    e2e: {
      task: require('./tasks/sequenceTest'),
      sequence: [
        'clean', ['inject', 'assets'],
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

}

module.exports = {
  mode: mode,
  init: init
};
