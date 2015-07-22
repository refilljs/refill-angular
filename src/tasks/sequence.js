'use strict';

function getSequenceDevTask(options, gulp, mode) {

  function sequenceDevTask(done) {

    var runSequence = require('run-sequence').use(gulp);
    var _ = require('lodash');

    _.extend(mode, options.mode);

    runSequence.apply(null, options.sequence.concat([done]));

  }

  return sequenceDevTask;

}

module.exports = {
  getTask: getSequenceDevTask
};
