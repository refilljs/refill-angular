'use strict';

function getSequenceTestTask(options, gulp, mode) {

  function sequenceTestTask(done) {
    var runSequence = require('run-sequence').use(gulp);
    mode.env = 'test';
    runSequence.apply(null, options.sequence.concat([done]));
  }

  return sequenceTestTask;

}

module.exports = {
  getTask: getSequenceTestTask
};
