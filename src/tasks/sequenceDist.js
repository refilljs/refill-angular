'use strict';

function getSequenceDistTask(options, gulp, mode) {

  function sequenceDistTask(done) {
    var runSequence = require('run-sequence').use(gulp);
    mode.dev = false;
    runSequence.apply(null, options.sequence.concat([done]));
  }

  return sequenceDistTask;

}

module.exports = {
  getTask: getSequenceDistTask
};
