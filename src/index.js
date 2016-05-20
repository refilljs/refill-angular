'use strict';

/**
 * @module zkflow-angular
 */

var zkflow = require('zkflow');
var browserifyNgannotate = require('browserify-ngannotate');
var babelify = require('babelify');
var babelPresetEs2015 = require('babel-preset-es2015');
var defaults = require('lodash.defaults');
var forEach = require('lodash.foreach');
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
 * @alias module:gulp-zkflow-angular.init
 */
function init(options, outputDirsMap, externalGulp) {

  var computedOptions;
  var computedOutputDirsMap;
  var babelifyTransform = [
    babelify,
    {
      presets: [babelPresetEs2015],
      sourceMaps: false,
      ignore: options.js.ignore
    }
  ];

  var defaultOptions = {
    assets: {
      task: require('zkflow-task-assets')
    },
    clean: {
      task: require('zkflow-task-clean')
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
        ['lint-js']
      ],
      mode: {
        env: 'prod',
        watch: false,
        eslintFix: false
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
      task: require('./tasks/css')
    },
    default: {
      task: require('zkflow-task-sequence'),
      sequence: [
        ['clean', 'lint-js', 'test'], ['inject', 'assets'],
        'webserver'
      ],
      mode: {
        eslintFix: false
      }
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
      dependencies: ['templates'],
      browserifyTransforms: [
        babelifyTransform,
        browserifyNgannotate
      ]
    },
    test: {
      task: require('zkflow-task-karma'),
      dependencies: ['templates'],
      browserifyTransforms: [
        babelifyTransform
      ]
    },
    'lint-js': {
      task: require('zkflow-task-eslint'),
      eslint: {
        rules: {
          quotes: [2, 'single'],
          semi: [2, 'always'],
          eqeqeq: 2,
          strict: 2,
          'vars-on-top': 2,
          'comma-style': 2,
          indent: [2, 2],
          'linebreak-style': [2, 'unix'],
          'one-var': [2, 'never'],
          'no-trailing-spaces': 2,
          'no-multiple-empty-lines': [2, { 'max': 2, 'maxBOF': 0, 'maxEOF': 0 }],
          camelcase: [2, { properties: 'never' }],
          'comma-spacing': 2,
          'key-spacing': 2,
          'object-curly-spacing': [2, 'always']
        },
        env: {
          commonjs: true,
          browser: true,
          jasmine: true,
          es6: true
        },
        parserOptions: {
          ecmaVersion: 6,
          sourceType: 'module'
        },
        extends: 'eslint:recommended'
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

  forEach(computedOptions, function(taskOptions, taskName) {
    computedOptions[taskName] = defaults({}, options[taskName], taskOptions);
  });

  zkflow(computedOptions, getGulp(externalGulp), mode, getOutputDir);

  return getOutputDir;

}

module.exports = {
  mode: mode,
  init: init
};
