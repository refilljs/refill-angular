'use strict';

module.exports = {
  assets: {
    enabled: true
  },
  beautify: {
    enabled: true
  },
  bower: {
    enabled: true
  },
  build: {
    enabled: true,
    sequence: [
      'clean', [
        'inject',
        'templates',
        'assets',
        'glyphiconfont'
      ]
    ]
  },
  ci: {
    enabled: true,
    sequence: [
      [
        'beautify',
        'build',
        'test'
      ]
    ]
  },
  clean: {
    enabled: true
  },
  css: {
    enabled: true,
    dependencies: ['bower']
  },
  default: {
    enabled: true,
    sequence: [
      'clean', [
        'inject',
        'templates',
        'assets',
        'glyphiconfont',
        'test'
      ],
      'webserver'
    ]
  },
  inject: {
    enabled: true,
    dependencies: ['js', 'css']
  },
  js: {
    enabled: true,
    dependencies: ['bower']
  },
  templates: {
    enabled: true
  },
  test: {
    enabled: true,
    dependencies: ['bower']
  },
  webserver: {
    enabled: true
  }
};
