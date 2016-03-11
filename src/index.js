'use strict';

/**
 * @module zkflow-angular
 */

var zkflow = require('zkflow');
var browserifyNgannotate = require('browserify-ngannotate');
var _ = require('lodash');
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
 * @param {string|array} [options.assets.globs='src\/**\/_assets\/**']
 *
 * @param {gulp} [externalGulp=require('gulp')]
 *
 * @alias module:gulp-zkflow-angular.init
 */
function init(options, outputDirsMap, externalGulp) {

  var computedOptions;
  var computedOutputDirsMap;

  var defaultOptions = {
    assets: {
      task: require('./tasks/assets')
    },
    beautify: {
      task: require('./tasks/beautify')
    },
    bower: {
      task: require('./tasks/bower')
    },
    clean: {
      task: require('./tasks/clean')
    },
    jshint: {
      task: require('./tasks/jshint')
    },
    templates: {
      task: require('./tasks/templates')
    },
    'webdriver-update': {
      task: require('./tasks/webdriverUpdate')
    },
    webserver: {
      task: require('./tasks/webserver')
    },
    assemble: {
      task: require('zkflow-task-sequence'),
      sequence: [
        'clean', ['inject', 'assets']
      ]
    },
    build: {
      task: require('zkflow-task-sequence'),
      sequence: [
        'assemble'
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    ci: {
      task: require('zkflow-task-sequence'),
      sequence: [
        'ci-static-analysis',
        'ci-test',
        'ci-build',
        'ci-e2e'
      ]
    },
    'ci-build': {
      task: require('zkflow-task-sequence'),
      sequence: [
        ['assemble']
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    'ci-e2e': {
      task: require('zkflow-task-sequence'),
      sequence: [
        ['e2e']
      ],
      mode: {
        env: 'test',
        watch: false
      }
    },
    'ci-static-analysis': {
      task: require('zkflow-task-sequence'),
      sequence: [
        ['beautify', 'jshint']
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    'ci-test': {
      task: require('zkflow-task-sequence'),
      sequence: [
        ['test']
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    css: {
      task: require('./tasks/css'),
      dependencies: ['bower']
    },
    default: {
      task: require('zkflow-task-sequence'),
      sequence: [
        'clean', ['inject', 'assets', 'jshint', 'test'],
        'webserver'
      ]
    },
    e2e: {
      task: require('./tasks/protractor'),
      dependencies: ['webdriver-update', 'assemble']
    },
    inject: {
      task: require('./tasks/inject'),
      dependencies: ['js', 'css']
    },
    js: {
      task: require('zkflow-task-browserify'),
      dependencies: ['bower', 'templates'],
      browserifyTransforms: [
        browserifyNgannotate
      ]
    },
    test: {
      task: require('zkflow-task-karma'),
      dependencies: ['bower', 'templates'],
      browsers: ['PhantomJS'],
      plugins: [require('karma-phantomjs-launcher')]
    }
  };

  var defaultOutputDirsMap = {
    prod: 'dist/',
    test: 'test/',
    dev: 'dev/'
  };

  function getOutputDir() {
    return computedOutputDirsMap[mode.env];
  }

  outputDirsMap = outputDirsMap || {};
  computedOutputDirsMap = _.defaults({}, defaultOutputDirsMap, outputDirsMap);

  options = options || {};
  computedOptions = _.defaults({}, defaultOptions, options);

  _.forEach(computedOptions, function(taskOptions, taskName) {
    computedOptions[taskName] = _.defaults({}, options[taskName], taskOptions);
  });

  zkflow(computedOptions, getGulp(externalGulp), mode, getOutputDir);

  return getOutputDir;

}

module.exports = {
  mode: mode,
  init: init
};
