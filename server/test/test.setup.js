const chai = require('chai');
const sinon = require('sinon');

function testHelpers() {
  global.chai = chai;
  global.expect = chai.expect;
  global.sinon = sinon
}

module.exports = testHelpers;
