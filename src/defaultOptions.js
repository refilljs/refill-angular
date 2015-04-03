'use strict';

module.exports = {
  assets: {
    enabled: true,
    globs: 'src/**/_assets/**'

  },
  beautify: {
    enabled: true,
    globs: [
      'src/**/*.js',
      'src/**/*.html',
      'gulp/**/*.js',
      'gulpfile.js'
    ]
  },
  bower: {
    enabled: true
  },
  build: {
    enabled: true,
    sequence: [
      'clean', [
        'inject',
        'assets'
      ]
    ]
  },
  ci: {
    enabled: true,
    sequence: [
      [
        'beautify',
        'build',
        'test',
        'jshint'
      ]
    ]
  },
  clean: {
    enabled: true
  },
  css: {
    enabled: true,
    dependencies: ['bower'],
    globs: 'src/index.less',
    watchGlobs: 'src/**/*.{less,css}'
  },
  default: {
    enabled: true,
    sequence: [
      'clean', [
        'inject',
        'assets',
        'jshint',
        'test'
      ],
      'webserver'
    ]
  },
  inject: {
    enabled: true,
    dependencies: ['js', 'css'],
    globs: 'src/index.html',
    injectablesGlobs: [
      'index*.js',
      'index*.css'
    ],
    absolute: true
  },
  js: {
    enabled: true,
    dependencies: ['bower', 'templates'],
    devEntries: ['./src/dev/index.js'],
    distEntries: ['./src/index.js']
  },
  jshint: {
    enabled: true,
    globs: [
      'gulpfile.js',
      'gulp/**/*.js',
      'src/**/*.js'
    ]
  },
  templates: {
    enabled: true,
    globs: 'src/**/_templates/**/*.html',
    angularModuleName: 'zk.templates'
  },
  test: {
    enabled: true,
    dependencies: ['bower', 'templates'],
    files: ['src/unitTests.js'],
    templatesModule: 'zk.templates',
    junitReporterOutputFile: 'test-results.xml'
  },
  webserver: {
    enabled: true
  }
};
