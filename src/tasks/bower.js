'use strict';

function getBowerTask() {

  function bowerTask() {

    var bower = require('gulp-bower');
    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('bower');

    logger.start();

    return bower()
      .on('error', logger.error)
      .on('end', logger.finished);

  }

  return bowerTask;

}

module.exports = {
  getTask: getBowerTask
};
