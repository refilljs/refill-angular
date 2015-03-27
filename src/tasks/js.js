'use strict';

function jsTask(options, gulp, mode) {

  gulp.task('js', options.dependencies, function() {

    var source = require('vinyl-source-stream');
    var watchify = require('watchify');
    var browserify = require('browserify');
    var uglify = require('gulp-uglify');
    var rev = require('gulp-rev');
    var gulpif = require('gulp-if');
    var streamify = require('gulp-streamify');
    var templateCache = require('gulp-angular-templatecache');
    var minifyHtml = require('gulp-minify-html');
    var gutil = require('gulp-util');
    var through2 = require('through2');
    var errorLog = require('../errorLog');
    var bundler;

    function requirify() {
      return through2.obj(function(chunk, env, cb) {
        if (chunk.isStream()) {
          this.emit('error', 'Cannot operate on stream');
        } else if (chunk.isBuffer()) {
          this.push(chunk.contents);
        }
        cb();
      });
    }

    function templetify() {
      return gulp.src(options.templatesGlobs)
        .pipe(gulpif(!mode.dev, minifyHtml({
          empty: true,
          spare: true,
          quotes: true
        })))
        .pipe(templateCache('templates.js', {
          standalone: true,
          module: options.templatesModule,
          root: '/',
          templateHeader: 'module.exports = angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {'
        }))
        .pipe(requirify());
    }

    function rebundle() {

      var stream;

      bundler.require(templetify(), {
        expose: options.templatesModule
      });
      stream = bundler.bundle();

      if (mode.dev) {
        stream = stream.on('error', errorLog('Browserify'));
      }

      return stream
        .pipe(source('index.js'))
        .pipe(gulpif(!mode.dev, streamify(uglify())))
        .pipe(gulpif(!mode.dev, streamify(rev())))
        .pipe(gulp.dest(mode.dev ? 'dev/' : 'dist/'))
        .on('end', function() {
          gutil.log(gutil.colors.magenta('browserify'), 'finished');
        });

    }

    gutil.log(gutil.colors.magenta('browserify'), 'starting...');

    bundler = browserify({
      cache: {},
      packageCache: {},
      fullPaths: true,
      entries: mode.dev ? options.devEntries : options.distEntries,
      debug: mode.dev
    });

    bundler.transform(require('debowerify'));
    bundler.transform(require('browserify-ngannotate'));
    bundler.exclude(options.templatesModule);

    if (mode.dev) {
      bundler = watchify(bundler);
      bundler.on('update', function(changedFiles) {
        gutil.log('Starting', gutil.colors.cyan('browserify'), 'file', changedFiles, 'changed');
      });
      bundler.on('update', rebundle);
      gulp.watch(options.templatesGlobs, rebundle)
        .on('change', function(changedFiles) {
          gutil.log('Starting', gutil.colors.cyan('browserify'), 'file', changedFiles.path, 'changed');
        });
    }

    return rebundle();

  });

}

module.exports = jsTask;
