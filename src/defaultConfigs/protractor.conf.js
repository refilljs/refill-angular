'use strict';

exports.config = {

  framework: 'cucumber',

  multiCapabilities: [{
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 3
  }, {
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 3
  }],

  baseUrl: 'http://localhost:8001',

  cucumberOpts: {
    require: process.cwd() + '/e2e/stepDefinitions/**/*.js'
  }

};
