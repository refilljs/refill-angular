'use strict';

exports.config = {

  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  allScriptsTimeout: 60000,
  getPageTimeout: 60000,

  multiCapabilities: [{
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 2
  }, {
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 2
  }],

  baseUrl: 'http://localhost:8001',

  cucumberOpts: {
    require: process.cwd() + '/e2e/stepDefinitions/**/*.js',
    format: 'summary'
  }

};
