'use strict';

var zkflowAngular = require('zkflow-angular');

zkflowAngular.init({
  e2e: {
    customConfigFiles: true,
    watchConfigFile: 'protractor.conf.js'
  }
}, undefined, require('gulp'));
