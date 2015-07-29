'use strict';

function getSequenceTask(options, gulp, mode) {

  function sequenceTask(done) {

    var runSequence = require('run-sequence').use(gulp);
    var _ = require('lodash');

    _.extend(mode, options.mode);

    runSequence.apply(null, options.sequence.concat([done]));

  }

  return sequenceTask;

}

module.exports = {
  getTask: getSequenceTask
};
