'use strict';

var cssGlobbing = require('gulp-css-globbing');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var streamify = require('gulp-streamify');
var rev = require('gulp-rev');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var refillWatcher = require('refill-watcher');
var refillLogger = require('refill-logger');
var refillGlobby = require('refill-globby');
var RefillNextHandler = require('refill-next-handler');

function getCssTask(options, gulp, mode, getOutputDir) {

  function cssTask(next) {

    var outputDir = getOutputDir();
    var logger = refillLogger('css');
    var nextHandler;

    var noCssFilesMessage =
      '\nNo css files found.\n\n' +
      'Your css files are determined by globs\n' +
      options.globs.toString() + '\n\n' +
      'You can add some matching files with css.\n' +
      'Learn more about ZKFlow css toolstack:\n' +
      'https://github.com/jsahlen/gulp-css-globbing\n' +
      'http://sass-lang.com/\n' +
      'https://github.com/postcss/autoprefixer\n' +
      'http://css.github.io/csso/\n';

    function runCss() {

      return nextHandler
        .handle(refillGlobby(options.globs, noCssFilesMessage), {
          ignoreFailures: true,
          handleSuccess: false
        })
        .then(function() {

          return nextHandler.handle(new Promise(function (resolve, reject) {

            gulp
              .src(options.globs, options.globsOptions)
              .pipe(plumber(reject))
              .pipe(cssGlobbing(options.cssGlobbing))
              .pipe(gulpif(mode.env === 'dev', sourcemaps.init(options.sourcemapsInit)))
              .pipe(sass(options.sass))
              .pipe(autoprefixer(options.autoprefixer))
              .pipe(gulpif(mode.env === 'dev', sourcemaps.write(options.sourcemapsWrite)))
              .pipe(gulpif(mode.env !== 'dev' && !mode.watch, csso(options.csso)))
              .pipe(gulpif(mode.env !== 'dev' && !mode.watch, streamify(rev())))
              .pipe(gulp.dest(outputDir + options.outputDirSuffix))
              .on('end', resolve);

          }));

        });

    }

    nextHandler = new RefillNextHandler({
      next: next,
      watch: mode.watch,
      logger: logger
    });

    refillWatcher.watch(runCss, mode.watch, options.globs, logger);

  }

  return cssTask;

}

module.exports = {
  getTask: getCssTask,
  defaultOptions: {
    globs: [
      'src/index.{scss,sass}',
      'src/**/_styles/*.{scss,sass}',
      'src/**/_styles/**/*.{scss,sass}'
    ],
    outputDirSuffix: '',
    cssGlobbing: {
      extensions: ['.sass', '.scss'],
      scssImportPath: {
        leading_underscore: false,
        filename_extension: false
      }
    },
    autoprefixer: {
      browsers: ['last 2 versions', 'ie 9'],
      cascade: false
    }
  }
};
