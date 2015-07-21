'use strict';

function getSequenceDevTask(options, gulp) {

  function sequenceDevTask(done) {
    var runSequence = require('run-sequence').use(gulp);
    runSequence.apply(null, options.sequence.concat([done]));
  }

  return sequenceDevTask;

}

module.exports = {
  getTask: getSequenceDevTask
};
