import angular from 'angular';

const appModule = angular.module('app', [])
  .controller('appNameController', function() {
    'ngInject';
  })
  .name;

export default appModule;