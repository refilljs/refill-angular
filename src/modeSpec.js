'use strict';

describe('mode', function() {

  function expectEnv(env, envVar) {
    envVar = envVar || 'REFILL_ENV';
    process.env[envVar] = env;
    expect(require('./mode').env).toEqual(env);
  }

  beforeEach(function() {
    delete require.cache[__dirname + '/mode.js'];
  });

  it('when there is no env variable should have dev env', function() {
    expect(require('./mode').env).toEqual('dev');
  });

  it('when REFILL_ENV=prod should have prod env', function() {
    expectEnv('prod');
  });

  it('when REFILL_ENV=dev should have dev env', function() {
    expectEnv('dev');
  });

  it('when REFILL_ENV=test should have test env', function() {
    expectEnv('test');
  });

  it('when bamboo_REFILL_ENV=prod should have prod env', function() {
    expectEnv('prod', 'bamboo_REFILL_ENV');
  });

  it('when bamboo_REFILL_ENV=dev should have dev env', function() {
    expectEnv('dev', 'bamboo_REFILL_ENV');
  });

  it('when bamboo_REFILL_ENV=test should have test env', function() {
    expectEnv('test', 'bamboo_REFILL_ENV');
  });

  afterEach(function() {
    delete process.env.REFILL_ENV;
    delete process.env.bamboo_REFILL_ENV;
  });

});
