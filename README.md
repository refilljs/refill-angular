# Gulp Zkflow for AngularJS

Made by Zaklinacze Kodu

This project is a set of industrial-grade gulp tasks aiming to organize your workflow with AngularJS.

### Shields

[![npm](https://img.shields.io/npm/v/gulp-zkflow-angular.svg?style=flat-square)](https://www.npmjs.com/package/gulp-zkflow-angular)
[![npm](https://img.shields.io/npm/l/gulp-zkflow-angular.svg?style=flat-square)](https://www.npmjs.com/package/gulp-zkflow-angular)
[![npm](https://img.shields.io/npm/dm/gulp-zkflow-angular.svg?style=flat-square)](https://www.npmjs.com/package/gulp-zkflow-angular)

[![Travis](https://img.shields.io/travis/zaklinaczekodu/gulp-zkflow-angular/master.svg?style=flat-square)](https://travis-ci.org/zaklinaczekodu/gulp-zkflow-angular)
[![Code Climate](https://img.shields.io/codeclimate/github/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://codeclimate.com/github/zaklinaczekodu/gulp-zkflow-angular)

[![David](https://img.shields.io/david/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://david-dm.org/zaklinaczekodu/gulp-zkflow-angular)
[![David](https://img.shields.io/david/dev/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://david-dm.org/zaklinaczekodu/gulp-zkflow-angular)

[![GitHub forks](https://img.shields.io/github/forks/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://github.com/zaklinaczekodu/gulp-zkflow-angular)
[![GitHub stars](https://img.shields.io/github/stars/zaklinaczekodu/gulp-zkflow-angular.svg?style=flat-square)](https://github.com/zaklinaczekodu/gulp-zkflow-angular)
[![GitHub followers](https://img.shields.io/github/followers/zaklinaczekodu.svg?style=flat-square)](https://github.com/zaklinaczekodu/gulp-zkflow-angular)

### Features

* Less + autoprefixer
* Browserify + ngannotate
* Assets management
* Bower
* AngularJS templates embedded in js
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
    * build + jshint + jsbeautifier + tests with guaranteed non-zero exit status on error
    
### Installation

Gulp Zkflow for AngularJS is available through npm

```Shell
npm install --save gulp
npm install --save gulp-zkflow-angular
```

### Usage

Put this line in your gulpfile.js

```JavaScript
require('gulp-zkflow-angular').init();
```