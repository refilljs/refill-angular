'use strict';

function getSequenceProdTask(options, gulp, mode) {

  function sequenceProdTask(done) {
    var runSequence = require('run-sequence').use(gulp);
    mode.env = 'prod';
    runSequence.apply(null, options.sequence.concat([done]));
  }

  return sequenceProdTask;

}

module.exports = {
  getTask: getSequenceProdTask
};
