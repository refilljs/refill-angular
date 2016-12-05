'use strict';

var path = require('path');
var refill = require('refill');
var defaults = require('lodash.defaults');
var forEach = require('lodash.foreach');
var mode = require('./mode');

function getGulp(externalGulp) {

  if (typeof externalGulp === 'undefined') {
    return require('gulp');
  }

  return externalGulp;

}

function init(options, outputDirsMap, externalGulp) {

  var computedOptions;
  var computedOutputDirsMap;

  var defaultOptions = {
    assets: {
      task: require('refill-task-assets')
    },
    clean: {
      task: require('refill-task-clean')
    },
    webserver: {
      task: require('./tasks/webserver')
    },
    assemble: {
      task: require('refill-task-sequence'),
      sequence: [
        'clean', ['inject', 'assets']
      ]
    },
    build: {
      task: require('refill-task-sequence'),
      sequence: [
        'assemble'
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    ci: {
      task: require('refill-task-sequence'),
      sequence: [
        'ci-static-analysis',
        'ci-test',
        'ci-build'
      ]
    },
    'ci-build': {
      task: require('refill-task-sequence'),
      sequence: [
        ['assemble']
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    'ci-static-analysis': {
      task: require('refill-task-sequence'),
      sequence: [
        ['lint-js']
      ],
      mode: {
        env: 'prod',
        watch: false,
        eslintFix: false
      }
    },
    'ci-test': {
      task: require('refill-task-sequence'),
      sequence: [
        ['test']
      ],
      mode: {
        env: 'prod',
        watch: false
      }
    },
    css: {
      task: require('./tasks/css')
    },
    default: {
      task: require('refill-task-sequence'),
      sequence: [
        ['clean', 'lint-js', 'test'], ['inject', 'assets'],
        'webserver'
      ],
      mode: {
        eslintFix: false
      }
    },
    inject: {
      task: require('./tasks/inject'),
      dependencies: ['js', 'css']
    },
    js: {
      task: require('refill-task-browserify')
    },
    test: {
      task: require('refill-task-karma')
    },
    'lint-js': {
      task: require('refill-task-eslint'),
      eslint: {
        configFile: path.join(__dirname, '.eslintrc.dist.json')
      }
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
  computedOutputDirsMap = defaults({}, defaultOutputDirsMap, outputDirsMap);

  options = options || {};
  computedOptions = defaults({}, defaultOptions, options);

  forEach(computedOptions, function (taskOptions, taskName) {
    computedOptions[taskName] = defaults({}, options[taskName], taskOptions);
  });

  refill(computedOptions, getGulp(externalGulp), mode, getOutputDir);

  return getOutputDir;

}

module.exports = {
  mode: mode,
  init: init
};
