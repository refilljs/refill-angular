'use strict';

var _ = require('lodash');

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
 * Load task from list if task is enabled
 * @param tasksNames
 * @param options
 * @param gulp
 */
function loadTasks(tasksNames, mode, options, gulp) {

  var defaultOptions = require('./defaultOptions');

  options = options || {};

  tasksNames.forEach(function(taskName) {

    var taskOptions = options[taskName];
    var taskDefaultOptions = defaultOptions[taskName];
    var compiledOptions = _.defaults(taskOptions || {}, taskDefaultOptions);

    if (!taskOptions.enabled) {
      return;
    }

    require('./tasks/' + taskName)(compiledOptions, gulp, mode);

  });

}

/**
 * Set zkflow angular tasks
 * @param options
 * @param externalGulp
 */
function gulpZkflowAngular(options, externalGulp) {

  var gulp = getGulp(externalGulp);
  var mode = {
    jsbeautifierVerifyOnly: false,
    dev: true,
    singleRun: true
  };

  loadTasks(
    ['assets', 'beautify', 'bower', 'build', 'ci', 'clean', 'css', 'default', 'inject', 'js', 'jshint', 'templates', 'test', 'webserver'],
    mode,
    options,
    gulp
  );

  return mode;

}

module.exports = gulpZkflowAngular;
