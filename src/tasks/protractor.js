'use strict';

function getProtractorTask(options, gulp, mode) {

  function protractorTask(next) {

    var protractor = require('gulp-protractor').protractor;
    var webserver = require('gulp-webserver');
    var path = require('path');
    var _ = require('lodash');
    var zkutils = require('gulp-zkflow-utils');
    var logger = new zkutils.Logger('e2e');
    var nextHandler;

    function getConfigPath() {
      var configDir = path.resolve(__dirname, '../defaultConfigs/');
      if (options.customConfigFiles) {
        return mode.watch ? options.watchConfigFile : options.configFile;
      }
      return path.resolve(configDir, mode.watch ? 'protractor.watch.conf.js' : 'protractor.conf.js');
    }

    function help() {
      logger.log('press "r" to rerun e2e tests or "^C" to quit');
    }

    function runProtractor() {

      var webserverStream;
      var promise;

      logger.start();

      promise = zkutils
        .promisify(gulp.src('test/')
          .pipe(webserver({
            fallback: 'index.html',
            livereload: false,
            port: 8001
          })))
        .then(function(stream) {
          webserverStream = stream;
          return zkutils
            .promisify(gulp.src('e2e/features/**/*.feature')
              .pipe(protractor({
                configFile: getConfigPath()
              })));
        });

      promise.finally(function() {
        webserverStream.emit('kill');
        if (mode.watch) {
          help();
        }
      });

      nextHandler.handle(promise);

    }

    _.extend(mode, options.mode);

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    runProtractor();

    if (mode.watch) {

      // this will start simple interactive mode. If you press "r" e2e tests will run, "^C" will stop execution
      process.stdin.setRawMode(true);
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', function(chunk) {

        var ctrlCCode = 3;

        if (chunk === 'r') {
          runProtractor();
          return;
        }
        if (chunk.charCodeAt(0) === ctrlCCode) {
          process.exit();
        }
        help();

      });

    }

  }

  return protractorTask;

}

module.exports = {
  getTask: getProtractorTask,
  defaultOptions: {
    customConfigFiles: false,
    configFile: 'protractor.conf.js',
    watchConfigFile: 'protractor.watch.conf.js'
  }
};
