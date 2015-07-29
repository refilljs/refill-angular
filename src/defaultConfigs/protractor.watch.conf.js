'use strict';

var protractorConf = require('./protractor.conf').config;

protractorConf.capabilities = protractorConf.multiCapabilities[0];
delete protractorConf.multiCapabilities;

exports.config = protractorConf;
