require('../test.setup')();
require('dotenv').config();
const Q = require('../../db/queries');
const request = require('supertest');
const knex = require('../../../server/db/knex');
const Testing = require('../test.helpers');
import Salesforce from '../../lib/salesforce';

describe('api applications', () => {
  let sandbox;
  let app;

  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    app = require('../../index');
    knex.raw("start transaction").then(() => { done(); });
  });

  afterEach((done) => {
    sandbox.restore();
    knex.raw("rollback").then(() => { done(); });
  });

  describe('PATCH api/v1/applications', () => {
    it('updates an exsiting application with values and completion', async () => {
      sandbox.stub(Salesforce.prototype, 'login').resolves(true)
      sandbox.stub(Salesforce.prototype, 'applicationStepUpdate').resolves(true)

      const courseType = '4 billion year immersive';
      const courseProduct = 'Life on Earth';
      const completeDate = "Mon Jun 03 2019 13:36:58"
      const userApplication = await Testing.userWithApplication(courseType, courseProduct);
      const res = await request(app)
        .patch(`/api/v1/applications/${userApplication.application.id}`)
        .set('Authorization', `Bearer ${userApplication.token}`)
        .send({
          course_type: courseType,
          course_product: courseProduct,
          values: JSON.stringify({"Campus__C":"dollop"}),
          complete: completeDate,
        })
        .expect(200)
      const body = res.body[0]
      const application = await Q.getApplication(body.id)

      expect(application.course_type).to.eq('4 billion year immersive');
      expect(application.course_product).to.eq('Life on Earth');
      expect(application.values['Campus__C']).to.eq("dollop");
      expect(application.complete.getTime()).to.eq(new Date(completeDate).getTime());
    })

    it('404s when no application exists for the course type and product for the user', async () => {
      sandbox.stub(Salesforce.prototype, 'login').resolves(true)
      sandbox.stub(Salesforce.prototype, 'applicationStepUpdate').resolves(true)

      const courseType = '4 billion year immersive';
      const courseProduct = 'Life on Earth';
      const token = await Testing.testUser();

      await request(app)
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          course_type: courseType,
          course_product: courseProduct,
          values: JSON.stringify({"Campus__C":"dollop"}),
        })
        .expect(404)
    })
  });

  describe('POST api/v1/applications/initialize/type/:type/product/:product', () => {
    it('stores a new application for the course type and product', (done) => {
      sandbox.stub(Salesforce.prototype, 'login').resolves(true)
      sandbox.stub(Salesforce.prototype, 'applicationStepUpdate').resolves(true)

      const courseType = encodeURIComponent('4 billion year immersive');
      const courseProduct = encodeURIComponent('Life on Earth');
      const url = `/api/v1/applications/initialize/type/${courseType}/product/${courseProduct}`

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

    it('updates an existing application for the course type and product', async () => {
      sandbox.stub(Salesforce.prototype, 'login').resolves(true)
      sandbox.stub(Salesforce.prototype, 'applicationStepUpdate').resolves(true)

      const courseType = encodeURIComponent('4 billion year immersive');
      const courseProduct = encodeURIComponent('Life on Earth');
      const url = `/api/v1/applications/initialize/type/${courseType}/product/${courseProduct}`
      const userApplication = await Testing.userWithApplication('4 billion year immersive', 'Life on Earth');
      const resp = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${userApplication.token}`)
        .send({})
        .expect(200)

      expect(resp.body.id).to.eq(userApplication.application.id)
    });
  })
})
