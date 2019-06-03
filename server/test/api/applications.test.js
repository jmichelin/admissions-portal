require('../test.setup')();
require('dotenv').config();
const Q = require('../../db/queries');
const request = require('supertest');
const knex = require('../../../server/db/knex');
const Testing = require('../test.helpers');

describe('api applications', () => {
  let sandbox;
  let app;

  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    app = require('../../index');
    knex.raw("start transaction").then(function () {
      done();
    });
  });

  afterEach((done) => {
    sandbox.restore();
    knex.raw("rollback").then(function () {
      done();
    });
  });

  describe('POST api/v1/applications/initialize/type/:type/product/:product', () => {
    it('stores a new application for the course type and product', (done) => {
      let courseType = encodeURIComponent('4 billion year immersive');
      let courseProgram = encodeURIComponent('Life on Earth');
      let url = `/api/v1/applications/initialize/type/${courseType}/product/${courseProgram}`
      Testing.testUser().then((token) => {
        request(app)
          .post(url)
          .set('Authorization', `Bearer ${token}`)
          .send()
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            Q.getApplication(res.body.id).then((application) => {
              expect(application.course_type).to.eq('4 billion year immersive');
              expect(application.course_product).to.eq('Life on Earth');
              done()

            })
          });
      })
    })
  })
})
