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

      logger.start();

      return zkutils
        .promisify(gulp.src('e2e/features/**/*.feature')
          .pipe(protractor({
            configFile: getConfigPath()
          })));

    }

    function handleProtractorPromise(protractorPromise) {
      nextHandler.handle(protractorPromise);
      if (mode.watch) {
        protractorPromise.finally(help);
      }
      return protractorPromise;
    }

    _.extend(mode, options.mode);

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    zkutils
      .promisify(gulp.src('test/')
        .pipe(webserver({
          fallback: 'index.html',
          livereload: false,
          port: 8001
        })))
      .then(function(webserverStream) {

        var protractorPromise = runProtractor();

        handleProtractorPromise(protractorPromise);

        if (!mode.watch) {
          protractorPromise.finally(function() {
            webserverStream.emit('kill');
          });
          return;
        }

        // this will start simple interactive mode. If you press "r" e2e tests will run, "^C" will stop execution
        process.stdin.setRawMode(true);
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function(chunk) {

          var ctrlCCode = 3;

          if (chunk.charCodeAt(0) === ctrlCCode) {
            webserverStream.emit('kill');
            process.exit();
          }

          if (chunk === 'r') {
            handleProtractorPromise(runProtractor());
            return;
          }

          help();

        });

      });

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
