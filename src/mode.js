'use strict';

/**
 * Allows to set different modes of tasks operation.<br>
 * <br>
 * mode.env - you can set or get environment mode. It can be 'dev', 'prod' or 'test'.<br>
 * By default it is set to 'dev'. You can change it be setting environment variable REFILL_ENV or bamboo_REFILL_ENV.<br>
 * <br>
 * For example<br>
 * REFILL_ENV=test gulp webserver<br>
 * <br>
 * Tasks can operate diffrently in diffrent environment.<br>
 *
 * @type {{env: string}}
 * @alias module:refill-angular.mode
 */
var mode = {
  env: getEnv('ENV', 'dev'),
  watch: getEnv('WATCH', 'true') === 'true' ? true : false,
  angularMainModuleProdFallback: false,
  eslintFix: true
};

function getEnv(name, defaultValue) {
  var env = process.env['REFILL_' + name] || process.env['bamboo_REFILL_' + name];

  if (typeof env === 'undefined') {
    return defaultValue;
  }

  return env;

}

module.exports = mode;
