'use strict';

/**
 * @module gulp-zkflow-angular
 */

var loadTasks = require('gulp-zkflow-load-tasks');
var mode = require('./mode');
var _ = require('lodash');

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
function init(options, externalGulp) {

  var zkutils = require('gulp-zkflow-utils');
  var chalk = require('chalk');
  var computedOptions;

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
      task: require('./tasks/sequence'),
      sequence: [
        'clean', ['inject', 'assets']
      ]
    },
    build: {
      task: require('./tasks/sequence'),
      sequence: [
        'assemble'
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    ci: {
      task: require('./tasks/sequence'),
      sequence: [
        'ci-static-analysis',
        'ci-test',
        'ci-build',
        'ci-e2e'
      ]
    },
    'ci-build': {
      task: require('./tasks/sequence'),
      sequence: [
        ['assemble']
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    'ci-e2e': {
      task: require('./tasks/sequence'),
      sequence: [
        ['e2e']
      ],
      mode: {
        env: 'test',
        watch: false
      }
    },
    'ci-static-analysis': {
      task: require('./tasks/sequence'),
      sequence: [
        ['beautify', 'jshint']
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    'ci-test': {
      task: require('./tasks/sequence'),
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
      task: require('./tasks/sequence'),
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
      task: require('./tasks/js'),
      enabled: true,
      dependencies: ['bower', 'templates']
    },
    test: {
      task: require('./tasks/test'),
      dependencies: ['bower', 'templates']
    }
  };

  console.log('');
  console.log(' %s %s for AngularJS  %s', zkutils.logger.prefix, chalk.green.bold('ZKFlow'), chalk.grey('made by Zaklinacze Kodu'));
  console.log('');

  computedOptions = _.defaults({}, defaultOptions, options);

  _.forEach(computedOptions, function(taskOptions, taskName) {
    computedOptions[taskName] = _.defaults({}, options[taskName], taskOptions);
  });

  loadTasks(computedOptions, getGulp(externalGulp), mode, require('./getOutputDir'));

}

module.exports = {
  mode: mode,
  init: init
};
