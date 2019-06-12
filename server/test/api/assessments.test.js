require('../test.setup')();
require('dotenv').config();
const Q = require('../../db/queries');
const request = require('supertest');
const Assessments = require('../../lib/assessments')
const knex = require('../../../server/db/knex');
const Testing = require('../test.helpers');

describe('api assessments', () => {
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

  describe('GET api/v1/assessments/user', () => {
    it("yields only the user's latest assessment for a given snippet id", (done) => {
      Testing.userWithThreeAssessments()
        .then((result) => {
          request(app)
            .get('/api/v1/assessments/user')
            .set('Authorization', `Bearer ${result.token}`)
            .send()
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body.length).to.eq(2);
              done()
            });
      });
    })
  })

  describe('GET api/v1/assessments/:id', () => {
    it('yields the given assessment when it belongs to the user', (done) => {
      Testing.userWithProcessingAssessment().then((result) => {
        request(app)
          .get(`/api/v1/assessments/${result.assessmentId}`)
          .set('Authorization', `Bearer ${result.token}`) 
          .send()
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.id).to.eq(result.assessmentId);
            expect(res.body.user_id).to.eq(result.userId);
            expect(res.body.snippet_id).to.eq(1);
            expect(res.body.status).to.eq('processing');
            expect(res.body.test_results).to.eq('');
            expect(res.body.updated_at).to.eq(null);
            done()
          });
      })
    })

    it("responds with 401 when a user tries to cancel someone else's assessment", (done) => {
      Testing.userWithProcessingAssessment().then((someoneElse) => {
        Testing.testUser().then((token) => {
          request(app)
            .get(`/api/v1/assessments/${someoneElse.assessmentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(401)
            .end((err, res) => {
              if (err) return done(err);
              done()
            });
        })
      })
    })
  })

  describe('PATCH api/v1/assessments/:id/cancel', () => {
    it('updates the assessment to cancel status', (done) => {
      Testing.userWithProcessingAssessment().then((result) => {
        request(app)
          .patch(`/api/v1/assessments/${result.assessmentId}/cancel`)
          .set('Authorization', `Bearer ${result.token}`) 
          .send({})
          .expect(200)
          .end((err, res) => {
            Q.getAssessment(result.assessmentId).then((assessment) => {

              expect(assessment.status).to.eq('canceled');
              expect(assessment.test_results).to.eq('Tests canceled');
              done()

            })
          });
      })
    })

    it("responds with 401 when a user tries to cancel someone else's assessment", (done) => {
      Testing.userWithProcessingAssessment().then((someoneElse) => {
        Testing.testUser().then((token) => {
          request(app)
            .patch(`/api/v1/assessments/${someoneElse.assessmentId}/cancel`)
            .set('Authorization', `Bearer ${token}`)
            .send({})
            .expect(401)
            .end((err, res) => {
              if (err) return done(err);
              done()
            });
        })
      })
    })
  })

  describe('POST api/v1/assessments', () => {
    it('responds with id of inserted assessment', (done) => {
      sandbox.stub(Assessments, 'post').resolves('');
      Testing.testUser().then((token) => {
        request(app)
          .post('/api/v1/assessments')
          .set('Authorization', `Bearer ${token}`) 
          .send({"snippet_id": 1,"answer": "def dogs"})
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            Q.getAssessment(res.body.id).then((assessment) => {

              expect(assessment.id).to.eq(res.body.id);
              expect(assessment.answer).to.eq('def dogs');
              expect(assessment.test_results).to.eq('');
              expect(assessment.status).to.eq('processing');
              expect(assessment.snippet_id).to.eq(1);
              done()

            })
          });
      })
    });

    it('responds "You already are running a test!" if a test is processing', (done) => {
      Testing.userWithProcessingAssessment().then((result) => {
        request(app)
          .post('/api/v1/assessments')
          .set('Authorization', `Bearer ${result.token}`) 
          .send({"snippet_id": 1,"answer": "def dogs"})
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.error).to.eq('You already are running a test!')
            done()
          });
      })
    });
  });
});

