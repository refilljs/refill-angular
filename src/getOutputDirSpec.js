'use strict';

describe('getOutputDir', function() {

  beforeEach(function() {
    this.mode = require('./mode');
    this.getOutputDir = require('./getOutputDir');
  });

  it('when mode.env = prod should get dist/ output dir', function() {
    this.mode.env = 'prod';
    expect(this.getOutputDir()).toEqual('dist/');
  });

  it('when mode.env = dev should get dev/ output dir', function() {
    this.mode.env = 'dev';
    expect(this.getOutputDir()).toEqual('dev/');
  });

  it('when mode.env = test should get test/ output dir', function() {
    this.mode.env = 'test';
    expect(this.getOutputDir()).toEqual('test/');
  });

});