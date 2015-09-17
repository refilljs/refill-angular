'use strict';

function getProtractorTask(options, gulp, mode) {

  var runnedTasks = require('minimist')(process.argv.slice(2))._;

  if (runnedTasks.indexOf('e2e') !== -1) {
    mode.env = 'test';
  }

  function protractorTask(next) {

    var zkutils = require('gulp-zkflow-utils');
    var logger = zkutils.logger('e2e');
    var protractor = require('gulp-protractor').protractor;
    var webserver = require('gulp-webserver');
    var path = require('path');
    var nextHandler;

    function getConfigPath() {
      var configDir = path.resolve(__dirname, '../defaultConfigs/');
      if (options.customConfigFiles) {
        return mode.watch ? options.watchConfigFile : options.configFile;
      }
      return path.resolve(configDir, mode.watch ? 'protractor.watch.conf.js' : 'protractor.conf.js');
    }

    function help() {
      logger.info('press "r" to rerun e2e tests or "^C" to quit');
    }

    function runProtractor() {

      var protractorPromise = nextHandler.handle(
          zkutils.globby(options.globs, 'No e2e test files found'), {
            ignoreFailures: true,
            handleSuccess: false
          })
        .then(function() {

          return nextHandler.handle(zkutils
            .promisify(gulp.src(options.globs)
              .pipe(protractor({
                configFile: getConfigPath()
              }))));

        });

      if (mode.watch) {
        protractorPromise.finally(help);
      }

      return protractorPromise;

    }

    nextHandler = new zkutils.NextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    zkutils.promisify(gulp.src('test/')
        .pipe(webserver({
          fallback: 'index.html',
          livereload: false,
          port: 8001
        })))
      .then(function(webserverStream) {

        var protractorPromise = runProtractor();

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
            logger.start();
            runProtractor();
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
    globs: [
      'e2e/features/*.feature',
      'e2e/features/**/*.feature'
    ],
    customConfigFiles: false,
    configFile: 'protractor.conf.js',
    watchConfigFile: 'protractor.watch.conf.js'
  }
};
