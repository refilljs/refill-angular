'use strict';

function getWebdriverUpdateTask(options) {


  function webdriverUpdateTask(next) {

    var webdriverUpdate = require('gulp-protractor').webdriver_update;

    webdriverUpdate(options.webdriverUpdateOptions, next);

  }

  return webdriverUpdateTask;

}

module.exports = {
  getTask: getWebdriverUpdateTask
};