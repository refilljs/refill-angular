'use strict';

var protractorConf = require('zkflow-angular/src/defaultConfigs/protractor.conf').config;

protractorConf.capabilities = protractorConf.multiCapabilities[1];
delete protractorConf.multiCapabilities;

exports.config = protractorConf;
