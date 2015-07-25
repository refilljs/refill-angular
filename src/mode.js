'use strict';

/**
 * Allows to set different modes of tasks operation.<br>
 * <br>
 * mode.env - you can set or get environment mode. It can be 'dev', 'prod' or 'test'.<br>
 * By default it is set to 'dev'. You can change it be setting environment variable ZKFLOW_ENV or bamboo_ZKFLOW_ENV.<br>
 * <br>
 * For example<br>
 * ZKFLOW_ENV=test gulp webserver<br>
 * <br>
 * Tasks can operate diffrently in diffrent environment.<br>
 *
 * @type {{env: string}}
 * @alias module:gulp-zkflow-angular.mode
 */
var mode = {
  env: getEnv('ENV', 'dev'),
  watch: getEnv('WATCH', 'true') === 'true' ? true : false
};

function getEnv(name, defaultValue) {
  var env = process.env['ZKFLOW_' + name] || process.env['bamboo_ZKFLOW_' + name];

  if (typeof env === 'undefined') {
    return defaultValue;
  }

  return env;

}

module.exports = mode;
