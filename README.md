Refill for AngularJS
====================

Module based on [Refill](https://github.com/refilljs/refill) with a set of gulp tasks specially designed to setup
quickly and develop easily your Angular app without need to generate a lot of code. It is highly configurable.
Just load it in your gulpfile.js and you are ready to go.

[<img alt="Made by Zaklinacze Kodu" src="http://zaklinaczekodu.com/_assets/madeBy.svg" width="200">](http://zaklinaczekodu.com)

[Facebook](https://www.facebook.com/zaklinaczekodu)

Shields
-------

[![npm](https://img.shields.io/npm/v/refill-angular.svg?style=flat-square)](https://www.npmjs.com/package/refill-angular)
[![npm](https://img.shields.io/npm/l/refill-angular.svg?style=flat-square)](https://www.npmjs.com/package/refill-angular)
[![npm](https://img.shields.io/npm/dm/refill-angular.svg?style=flat-square)](https://www.npmjs.com/package/refill-angular)
[![Travis](https://img.shields.io/travis/refilljs/refill-angular/master.svg?style=flat-square)](https://travis-ci.org/refilljs/refill-angular)<br>
[![bitHound Overall Score](https://www.bithound.io/github/refilljs/refill-angular/badges/score.svg)](https://www.bithound.io/github/refilljs/refill-angular)
[![bitHound Dependencies](https://www.bithound.io/github/refilljs/refill-angular/badges/dependencies.svg)](https://www.bithound.io/github/refilljs/refill-angular/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/refilljs/refill-angular/badges/devDependencies.svg)](https://www.bithound.io/github/refilljs/refill-angular/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/refilljs/refill-angular/badges/code.svg)](https://www.bithound.io/github/refilljs/refill-angular)<br>
[![GitHub forks](https://img.shields.io/github/forks/refilljs/refill-angular.svg?style=flat-square)](https://github.com/refilljs/refill-angular)
[![GitHub stars](https://img.shields.io/github/stars/refilljs/refill-angular.svg?style=flat-square)](https://github.com/refilljs/refill-angular)
[![GitHub followers](https://img.shields.io/github/followers/refilljs.svg?style=flat-square)](https://github.com/refilljs/refill-angular)

Features
--------

* Sass + css globbing + autoprefixer
* Browserify + babel+ ngannotate
* Assets management
* Development environment
    * Webserver with livereload
    * Watching files for changes and full, fast, incremental rebuilds
    * Unit tests with karma
    * Eslint

* Production environment
    * js, css, jpg, png and svg minification
    * cache busting

* Continous integration
    * build + eslint + tests with guaranteed non-zero exit status on error

Why not just write tasks yourself?
----------------------------------

To not repeat yourself, and to get rid of some nasty edge cases:

* tasks immune to errors resulting crashed watchers
* tasks parametrized with tasks modes
* tasks cannot run few times simultaneously after few quick changes
* in develop mode if task detect some errors it will hold execution until all errors will be corrected and then it will let the rest of dependent tasks run
* tasks in prod mode always returns non-zero exit status on error

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

Node-gyp is used to compile native extensions to node. Refill for angular does not require node-gyp directly, but it is installed
by its dependencies. To install this dependencies properly you need to satisfy node-gyp requirements.
Go to [node-gyp github page](https://github.com/TooTallNate/node-gyp) and follow instructions in "You will also need to install" paragraph in README file (python etc.)

Installation
------------

Refill for AngularJS is available through npm

```Shell
npm install --save gulp refill-angular
```

Put this line in your gulpfile.js

```JavaScript
require('refill-angular').init();
```

This will create a set of tasks in gulp, which you will be able to use from console

Development flow
----------------

How you can use Refill gulp tasks to work with Your AngularJS project

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
* run eslint and rerun on any js file change
* run tests with karma and browserify and watch file changes with watchify
* bundle your angular templates into angular module (.tmp/templates.js) and rebundle on any template file change
* copy your assets and copy any newly created asset since then
* copy Your index.html and inject styles, scripts, angular main module name into it. Redo on index.html change.
* start gulp-webserver with livereload
* open Your default web browser with proper address.

Write some code, enjoy the results

### lint your code

Run in project root directory

```Shell
./node_modules/.bin/gulp lint-js
```

eslint will try to fix all found errors

### check everything

Run in project root directory

```Shell
./node_modules/.bin/gulp ci
```

This task will fail if

* code isn't eslinted
* any of karma tests will fail
* build fail (sass, browserify)

You definitely should add this task to your CI server. This task can be splitted into stages.
`./node_modules/.bin/gulp ci` is an equivalent for

```Shell
./node_modules/.bin/gulp ci-static-analysis
./node_modules/.bin/gulp ci-test
./node_modules/.bin/gulp ci-build
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
* copy your assets and minify all .png/.jpg/.gif/.svg
* copy Your index.html, minify html and inject styles, scripts, angular main module name into it.
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
  .controller('appNameController', /** @ngInject */ function() {
  });
```


API
---

If you get 'task not found' error from gulp, you probably should pass gulp to init

```JavaScript
require('refill-angular').init(undefined, undefined, require('gulp'));
```

### options

You can pass options object to init function

```JavaScript
require('refill-angular').init(options, outputDirsMap);
```

Make sure you understand [how Refill works](https://github.com/refilljs/refill)

#### Default options

We recommend using as much default options as possible. They are based on our experience with AngularJS and
they set up some solid structure for your project.

```JavaScript
{
  assets: {
    task: require('refill-task-assets'),
    enabled: true,
    dependencies: [],
    globs: 'src/**/_assets/**',
    globsOptions: {
      base: './'
    },
    imagemin: undefined //options for gulp-imagemin
  },
  clean: {
    task: require('refill-task-clean')
    enabled: true,
    dependencies: []
  },
  templates: {
    task: require('refill-angular/src/tasks/templates')
    enabled: true,
    dependencies: [],
    globs: [
      'src/**/_templates/*.html',
      'src/**/_templates/**/*.html'
    ],
    globsOptions: undefined,
    htmlmin: undefined,
    templateCache: {
      standalone: true,
      module: 'zk.templates',
      root: '/',
      moduleSystem: 'browserify',
      templateFooter: '}]).name;'
    },
    templateModuleFileName: 'templates.js',
    outputDir: '.tmp/'
  },
  'webdriver-update': {
    task: require('refill-angular/src/tasks/webdriverUpdate')
    enabled: true,
    dependencies: [],
    webdriverUpdate: undefined
  },  
  webserver: {
    task: require('refill-angular/src/tasks/webserver')
    enabled: true,
    dependencies: [],
    host: 'localhost'
  },
  assemble: {
    task: require('refill-task-sequence'),
    enabled: true,
    dependencies: [],
    sequence: [
      'clean', ['inject', 'assets']
    ],
    mode: undefined
  },
  build: {
    task: require('refill-task-sequence'),
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
    task: require('refill-task-sequence'),
    enabled: true,
    dependencies: [],
    sequence: [
      'ci-static-analysis',
      'ci-test',
      'ci-build',
      'ci-e2e'
    ],
    mode: undefined
  },
  'ci-build': {
    task: require('refill-task-sequence'),
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
    task: require('refill-task-sequence'),
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
    task: require('refill-task-sequence'),
    enabled: true,
    dependencies: [],
    sequence: [
      ['lint-js']
    ],
    mode: {
      env: 'prod',
      watch: false
    }
  },
  'ci-test': {
    task: require('refill-task-sequence'),
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
    task: require('refill-angular/src/tasks/css'),
    enabled: true,
    dependencies: [],
    globs: [
      'src/index.scss',
      'src/**/_styles/*.{scss,sass}',
      'src/**/_styles/**/*.{scss,sass}'
    ],
    globsOptions: undefined,
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
    csso: undefined
  },
  default: {
    task: require('refill-task-sequence'),
    enabled: true,
    dependencies: [],
    sequence: [
      ['clean', 'lint-js', 'test'], ['inject', 'assets'],
      'webserver'
    ],
    mode: undefined
  },
  e2e: {
    task: require('refill-angular/src/tasks/protractor'),
    enabled: true,
    dependencies: ['webdriver-update', 'assemble'],
    globs: [
      'e2e/features/*.feature',
      'e2e/features/**/*.feature'
    ],
    globsOptions: undefined
    customConfigFiles: false,
    configFile: 'protractor.conf.js',
    watchConfigFile: 'protractor.watch.conf.js'
  },
  inject: {
    task: require('refill-angular/src/tasks/inject'),
    enabled: true,
    dependencies: ['js', 'css'],
    globs: 'src/index.html',
    globsOptions: undefined
    injectablesGlobs: [
      'index*.js',
      'index*.css'
    ],
    injectablesGlobsOptions: {
      read: false
    },
    headInjectablesGlobs: undefined,
    absolute: true,
    prodAngularMainModuleName: 'app',
    devAngularMainModuleName: 'appDev',
    testAngularMainModuleName: 'appTest',
    htmlmin: undefined
  },
  js: {
    task: require('refill-task-browserify'),
    enabled: true,
    dependencies: ['templates'],
    browserifyTransforms: [
      [require('babelify'), { presets: [require('babel-preset-es2015')], sourceMaps: false }],
      require('browserify-ngannotate'),
    ]
  },
  'lint-js': {
    task: require('refill-task-eslint'),
    enabled: true,
    dependencies: [],
    eslint: {
      rules: {
        quotes: [2, 'single'],
        semi: [2, 'always'],
        eqeqeq: 2,
        strict: 2,
        'vars-on-top': 2,
        'comma-style': 2,
        indent: [2, 2],
        'linebreak-style': [2, 'unix'],
        'one-var': [2, 'never'],
        'no-trailing-spaces': 2,
        'no-multiple-empty-lines': [2, { 'max': 2, 'maxBOF': 0, 'maxEOF': 0 }],
        camelcase: [2, { properties: 'never' }],
        'comma-spacing': 2,
        'key-spacing': 2,
        'object-curly-spacing': [2, 'always']
      },
      env: {
        commonjs: true,
        browser: true,
        jasmine: true,
        es6: true
      },
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      extends: 'eslint:recommended'
    }
  },
  test: {
    task: require('refill-task-karma'),
    enabled: true,
    dependencies: ['templates'],
    browserifyTransforms: [
      [require('babelify'), { presets: [require('babel-preset-es2015')], sourceMaps: false }]
    ]
  }
}
```

### output dirs map

You can pass output dirs map object to init function.
This object maps current environment to output dir.

```JavaScript
require('refill-angular').init(options, outputDirsMap);
```

#### Default output dirs map

```
{
  prod: 'dist/',
  test: 'test/',
  dev: 'dev/'
}
```

### mode

You can retrieve mode object from refill

```JavaScript
var mode = require('refill-angular').mode;
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
REFILL_ENV=prod REFILL_WATCH=false ./node_modules/.bin/gulp css
```

which is equivalent to

```Shell
bamboo_REFILL_ENV=prod bamboo_REFILL_WATCH=false ./node_modules/.bin/gulp css
```

Some tasks overwrites mode

Sponsors
--------

[<img alt="Zaklinacze Kodu" src="http://zaklinaczekodu.com/_assets/logo.svg" width="200">](http://zaklinaczekodu.com)
