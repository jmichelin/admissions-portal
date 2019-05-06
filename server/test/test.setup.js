const chai = require('chai');
const sinon = require('sinon');
require('babel-register')({
   presets: [ 'es2015' ]
});

function testHelpers() {
  global.chai = chai;
  global.expect = chai.expect;
  global.sinon = sinon
}

module.exports = testHelpers;
