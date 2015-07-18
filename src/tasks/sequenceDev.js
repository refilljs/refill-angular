'use strict';

function getSequenceDevTask(options, gulp, mode) {

  function sequenceDevTask(done) {
    var runSequence = require('run-sequence').use(gulp);
    mode.env = 'dev';
    runSequence.apply(null, options.sequence.concat([done]));
  }

  return sequenceDevTask;

}

module.exports = {
  getTask: getSequenceDevTask
};
