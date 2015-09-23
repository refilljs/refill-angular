Gulp Zkflow for AngularJS
=========================

Automation for AngularJS projects powered by [Gulp](http://gulpjs.com/) 

Made by Zaklinacze Kodu

Shields
-------

[![npm](https://img.shields.io/npm/v/gulp-zkflow-angular.svg?style=flat-square)](https://www.npmjs.com/package/gulp-zkflow-angular)
[![npm](https://img.shields.io/npm/l/gulp-zkflow-angular.svg?style=flat-square)](https://www.npmjs.com/package/gulp-zkflow-angular)
[![npm](https://img.shields.io/npm/dm/gulp-zkflow-angular.svg?style=flat-square)](https://www.npmjs.com/package/gulp-zkflow-angular)<br>
[![Travis](https://img.shields.io/travis/zaklinaczekodu/gulp-zkflow-angular/master.svg?style=flat-square)](https://travis-ci.org/zaklinaczekodu/gulp-zkflow-angular)
[![Code Climate](https://img.shields.io/codeclimate/github/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://codeclimate.com/github/zaklinaczekodu/gulp-zkflow-angular)<br>
[![David](https://img.shields.io/david/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://david-dm.org/zaklinaczekodu/gulp-zkflow-angular)
[![David](https://img.shields.io/david/dev/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://david-dm.org/zaklinaczekodu/gulp-zkflow-angular)<br>
[![GitHub forks](https://img.shields.io/github/forks/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://github.com/zaklinaczekodu/gulp-zkflow-angular)
[![GitHub stars](https://img.shields.io/github/stars/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://github.com/zaklinaczekodu/gulp-zkflow-angular)
[![GitHub followers](https://img.shields.io/github/followers/zaklinaczekodu.svg?style=flat-square)](https://github.com/zaklinaczekodu/gulp-zkflow-angular)

Features
--------

* Sass + saasdoc + css globbing + autoprefixer
* Browserify + ngannotate
* Assets management
* Bower
* AngularJS templates embedded in js
* E2E tests with protractor and cucumber
* Development environment
    * Webserver with livereload
    * Watching files for changes and full, fast, incremental rebuilds
    * Unit tests with karma
    * jshint
    * jsbeautifier
    
* Production environment
    * js, css, jpg, png and svg minification
    * cache busting
    
* Continous integration
    * build + jshint + jsbeautifier + tests + e2e with guaranteed non-zero exit status on error
        
Requirements
------------

You need: 

* [nodejs](http://nodejs.org/download/)
* updated npm
* satisfy [node-gyp](https://github.com/TooTallNate/node-gyp) dependencies


### nodejs

If you've never used Node or npm before, you'll need to install Node.
If you use homebrew, do:

```Shell
brew install node
```

Otherwise, you can [download](http://nodejs.org/download/) and install it manually.

### updated npm

Update npm by running

```Shell
npm update npm -g
```

### node-gyp dependencies

Node-gyp is used to compile native extensions to node. Zkflow does not require node-gyp directly, but it is installed
by its dependencies. To install this dependencies properly you need to satisfy node-gyp requirements.
Go to [node-gyp github page](https://github.com/TooTallNate/node-gyp) and follow instructions in "You will also need to install" paragraph in README file (python etc.)

Installation
------------

Gulp Zkflow for AngularJS is available through npm

```Shell
npm install --save gulp gulp-zkflow-angular
```

Put this line in your gulpfile.js

```JavaScript
require('gulp-zkflow-angular').init();
```

This will create a set of tasks in gulp, which you will be able to use from console

Development flow
----------------

How you can use ZKflow gulp tasks to work with Your AngularJS project

### write code and test

Run in project root directory

```Shell
./node_modules/.bin/gulp
```

or

```Shell
./node_modules/.bin/gulp default
```

This task will

* clean whole output dir (dev/)
* bundle all your js with browserify and watch file changes with watchify
* bundle all your styles with sass, css globbing and autoprefix
* generate documentation with sassdoc if enabled
* run jshint and rerun on any js file change
* run tests with karma and browserify and watch file changes with watchify
* run bower install
* bundle your angular templates into angular module (.tmp/templates.js) and rebundle on any template file change
* copy your assets and copy any newly created asset since then
* copy Your index.html and inject styles, scripts, angular main module name into it. Redo on index.html change.
* start gulp-webserver with livereload
* open Your default web browser with proper address.

Write some code, enjoy the results

### write e2e tests

Run in project root directory

```Shell
./node_modules/.bin/gulp e2e
```

This task will

* clean whole output dir (test/)
* same as in default task, but will try to start from test module (where you can put Your e2e mocks)
* run protractor and rerun every time you press 'r'

Write some tests

### beautify your code

Run in project root directory

```Shell
./node_modules/.bin/gulp beautify
```

all your code will be automatically beatified with jsbeautifier

### check everything

Run in project root directory

```Shell
./node_modules/.bin/gulp ci
```

This task will fail if

* code isn't beautified
* code isn't jshinted
* any of karma tests will fail
* any of protractor e2e tests will fail
* build fail (sass, browserify)

You definitly should add this task to your CI server. This task can be splitted into stages.
`./node_modules/.bin/gulp ci` is an equivalent for

```Shell
./node_modules/.bin/gulp ci-static-analysis
./node_modules/.bin/gulp ci-test
./node_modules/.bin/gulp ci-build
./node_modules/.bin/gulp ci-e2e
```

### commit :D

```Shell
git commit -m 'awesome code'
```

Production flow
---------------

### installing

```Shell
npm install
```

### building

```Shell
./node_modules/.bin/gulp build
```

This task will

* clean whole output dir (dist/)
* bundle all your js with browserify and minify with uglifyjs
* bundle all your styles with sass, css globbing, autoprefix and minify with csso
* generate documentation with sassdoc if enabled
* run bower install
* bundle your angular templates into angular module (.tmp/templates.js) and minify with htmlminify
* copy your assets and minify all .png/.jpg/.gif/.svg
* copy Your index.html, htmlminify and inject styles, scripts, angular main module name into it.
* Do cache busting

### Apache/Nginx

Point it to `./dist` directory, and configure your server to fallback to index.html if file not found (to work with router html5 mode)

Directory structure
-------------------

* dist/ - build output
* dev/ - dev output
* test/ - e2e output

Files
-----

### .gitignore

You should probably add this entries in .gitignore file

```
bower_components/
npm-debug.log
node_modules/
.tmp/
dist/
dev/
test/
reports/
```

### src/index.html

```html
<!DOCTYPE html>
<html ng-app="<%= angularMainModuleName %>" lang="en">

<head>
  <meta charset="UTF-8">
  <title></title>
</head>

<body ng-controller="appNameController">

  <!-- inject:js -->
  <!-- endinject -->
</body>

</html>
```

### src/index.js

```JavaScript
'use strict';

var angular = require('angular');

angular.module('app', [
    require('../.tmp/templates.js').name
  ])
  .controller('appController', /** @ngInject */ function() {
  });
```


API
---

If you get 'task not found' error from gulp, you probably should pass gulp to init

```JavaScript
require('gulp-zkflow-angular').init(undefined, require('gulp'));
```

### options

You can pass options object to init function

```JavaScript
require('gulp-zkflow-angular').init(options);
```

Default options

```JavaScript
{
  assets: {
    enabled: true,
    dependencies: [],
    globs: 'src/**/_assets/**'
  },
  beautify: {
    enabled: true,
    dependencies: [],
    globs: [
      'src/*.js',
      'src/**/*.js',
      'src/*.html',
      'src/**/*.html',
      'gulp/*.js',
      'gulp/**/*.js',
      'gulpfile.js'
    ]
  },
  bower: {
    enabled: true,
    dependencies: []
  },
  clean: {
    enabled: true,
    dependencies: []
  },
  jshint: {
    enabled: true,
    dependencies: [],
    globs: [
      'gulpfile.js',
      'gulp/*.js',
      'gulp/**/*.js',
      'src/*.js',
      'src/**/*.js'
    ],
    jshintrc: false
  },
  templates: {
    enabled: true,
    dependencies: [],
    globs: [
      'src/**/_templates/*.html',
      'src/**/_templates/**/*.html'
    ],
    angularModuleName: 'zk.templates'
  },
  'webdriver-update': {
    enabled: true,
    dependencies: []
  },
  webserver: {
    enabled: true,
    dependencies: [],
    host: 'localhost'
  },
  assemble: {
    enabled: true,
    dependencies: [],
    sequence: [
      'clean', ['inject', 'assets']
    ]
  },
  build: {
    enabled: true,
    dependencies: [],
    sequence: [
      'assemble'
    ],
     mode: {
       env: 'prod',
       watch: false
     }
  },
  ci: {
    enabled: true,
    dependencies: [],
    sequence: [
      'ci-static-analysis',
      'ci-test',
      'ci-build',
      'ci-e2e'
    ]
  },
  'ci-build': {
    enabled: true,
    dependencies: [],
    sequence: [
      ['assemble']
    ],
    mode: {
      env: 'prod',
      watch: false
    }
  },
  'ci-e2e': {
    enabled: true,
    dependencies: [],
    sequence: [
      ['e2e']
    ],
    mode: {
      env: 'test',
      watch: false
    }
  },
  'ci-static-analysis': {
    enabled: true,
    dependencies: [],
    sequence: [
      ['beautify', 'jshint']
    ],
    mode: {
      env: 'prod',
      watch: false
    }
  },
  'ci-test': {
    enabled: true,
    dependencies: [],
    sequence: [
      ['test']
    ],
    mode: {
      env: 'prod',
      watch: false
    }
  },
  css: {
    enabled: true,
    dependencies: ['bower']
    globs: [
      'src/index.scss',
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
    },
    sass: undefined,
    sourcemapsInit: undefined,
    sourcemapsWrite: undefined,
    cssoStructureMinimization: undefined,
    sassdoc: {
      dest: 'docs/sass/'
    }
  },
  default: {
    enabled: true,
    dependencies: [],
    sequence: [
      'clean', ['inject', 'assets', 'jshint', 'test'],
      'webserver'
    ]
  },
  e2e: {
    enabled: true,
    dependencies: ['webdriver-update', 'assemble'],
    globs: [
      'e2e/features/*.feature',
      'e2e/features/**/*.feature'
    ],
    customConfigFiles: false,
    configFile: 'protractor.conf.js',
    watchConfigFile: 'protractor.watch.conf.js'
  },
  inject: {
    enabled: true,
    dependencies: ['js', 'css'],
    globs: 'src/index.html',
    injectablesGlobs: [
      'index*.js',
      'index*.css'
    ],
    absolute: true,
    prodAngularMainModuleName: 'app',
    devAngularMainModuleName: 'appDev',
    testAngularMainModuleName: 'appTest'
  },
  js: {
    enabled: true,
    dependencies: ['bower', 'templates'],
    devEntries: 'src/dev/index.js',
    prodEntries: 'src/index.js',
    testEntries: 'src/test/index.js'
  },
  test: {
    enabled: true,
    dependencies: ['bower', 'templates'],
    files: [
      'src/*Spec.js',
      'src/**/*Spec.js'
    ],
    reportsBaseDir: 'reports/test/',
    junitReporterOutputDir: 'junit/',
    htmlReporterOutputDir: 'html/',
    istanbulIgnore: [
      '**/node_modules/**',
      '**/bower_components/**',
      '*Spec.js',
      '**/*Spec.js'
    ],
    istanbulReporters: [{
      type: 'html',
      subdir: 'coverageHtml'
    }, {
      type: 'clover',
      subdir: 'coverageClover'
    }]
  }
}
```

### mode

you can retrieve mode object from zkflow

```JavaScript
var mode = require('gulp-zkflow-angular').mode;
```

This object is shared across all tasks and it define mode of operation.

Default mode

```JavaScript
{
  env: 'dev',
  watch: true,
  angularMainModuleProdFallback: false
}
```

Some of the mode properties can be changed on run by environment variables

```Shell
ZKFLOW_ENV=prod ZKFLOW_WATCH=false ./node_modules/.bin/gulp css
```

which is equivalent to

```Shell
bamboo_ZKFLOW_ENV=prod bamboo_ZKFLOW_WATCH=false ./node_modules/.bin/gulp css
```

Some tasks overwrites mode