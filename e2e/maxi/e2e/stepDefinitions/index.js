'use strict';

function indexStepDefinition() {

  browser.driver.manage().window().setSize(1920, 1080);

  this.Then('load page with angular', function() {
    return browser.get('/');
  });

}

module.exports = indexStepDefinition;