require('../../test.setup')();
require('dotenv').config();
const Q = require('../../../db/queries');
const request = require('supertest');
const Testing = require('../../test.helpers');
const knex = require('../../../../server/db/knex');

describe('webhook assessments', () => {
  let sandbox;
  let app;

  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    app = require('../../../index');
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

  describe('PATCH webhook/assessments/:id', () => {
    it('updates assessment results and status', (done) => {
      Testing.userWithProcessingAssessment().then((result) => {
        request(app)
          .patch(`/webhooks/assessments/${result.assessmentId}?token=${process.env.ASSESSMENTS_CALLBACK_TOKEN}`)
          .send("results=2/2-Correct&status=correct")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            Q.getAssessment(result.assessmentId).then((assessment) => {

              expect(assessment.status).to.eq('correct');
              expect(assessment.test_results).to.eq('2/2-Correct');
              expect(assessment.updated_at).to.not.eq(null);
              done()

            })
          });
      })
    })

    it('Is unauthorized without the assessments callback token', (done) => {
      Testing.userWithProcessingAssessment().then((result) => {
        request(app)
          .patch(`/webhooks/assessments/${result.assessmentId}?token=ohnothisisnotright`)
          .send("results=2/2-Correct&status=correct")
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            Q.getAssessment(result.assessmentId).then((assessment) => {

              expect(assessment.status).to.eq('processing');
              expect(assessment.test_results).to.eq('');
              done()

            })
          });
      })
    })
  })
})
