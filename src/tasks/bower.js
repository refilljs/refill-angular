'use strict';

function getBowerTask() {

  function bowerTask() {

    var bower = require('gulp-bower');
    var bowerLogger = require('../utils/logger')('bower');

    return bower()
      .on('error', bowerLogger.error)
      .on('end', bowerLogger.finished);

  }

  return bowerTask;

}

module.exports = {
  getTask: getBowerTask
};
