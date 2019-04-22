require('../test.setup')();
require('dotenv').config();
const Q = require('../../db/queries');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const Assessments = require('../../lib/assessments')
const knex = require('../../../server/db/knex');

describe('api assessments', () => {
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

  describe('GET api/v1/assessments/user', () => {
    it("yields only the user's latest assessment for a given snippet id", (done) => {
      userWithThreeAssessments().then((result) => {
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
      userWithProcessingAssessment().then((result) => {
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
      userWithProcessingAssessment().then((someoneElse) => {
        testUser().then((token) => {
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
      userWithProcessingAssessment().then((result) => {
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
      userWithProcessingAssessment().then((someoneElse) => {
        testUser().then((token) => {
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
      testUser().then((token) => {
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
      userWithProcessingAssessment().then((result) => {
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

function testUser() {
  let user = {email: "tu@example.com", first_name: "F", last_name: "L"};
  return Q.addNewUser(user, "password").then((savedUser) => {
    const payload = {
      id: savedUser[0].id,
      email: savedUser[0].email,
      first_name: savedUser[0].first_name,
      last_name: savedUser[0].last_name
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '6h'});
  })
}

function userWithProcessingAssessment() {
  let user = {email: "lf@example.com", first_name: "F", last_name: "L"};
  return Q.addNewUser(user, "password").then((savedUser) => {
    let assessment = {
      snippet_id: 1,
      answer: "an answer",
      status: 'processing',
      test_results: '',
      user_id: savedUser[0].id
    }
    return Q.addNewAssessment(assessment).then((savedAssessment) => {
      const payload = {
        id: savedUser[0].id,
        email: savedUser[0].email,
        first_name: savedUser[0].first_name,
        last_name: savedUser[0].last_name
      };
      return {
        token: jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '6h'}),
        assessmentId: savedAssessment[0].id,
        userId: savedUser[0].id
      }
    })
  })
}

function userWithThreeAssessments() {
  let user = {email: "lf@example.com", first_name: "F", last_name: "L"};
  return Q.addNewUser(user, "password").then((savedUser) => {
    let assessment1 = knex('assessment')
      .insert({
        snippet_id: 1,
        answer: "old don see",
        status: "incorrect",
        test_results: "tests came back",
        user_id: savedUser[0].id,
        created_at: new Date("2019-01-02")
      }).returning('*')
    let assessment2 = knex('assessment')
      .insert({
        snippet_id: 1,
        answer: "latest n' greatest",
        status: "correct",
        test_results: "tests came back positive",
        user_id: savedUser[0].id,
        created_at: new Date("2019-01-05")
      }).returning('*')
    let assessment3 = knex('assessment')
      .insert({
        snippet_id: 2,
        answer: "Only one for Snippet 2",
        status: "processing",
        test_results: "tests aren't back yet",
        user_id: savedUser[0].id,
        created_at: new Date("2019-01-05")
      }).returning('*')

    return Promise.all([assessment1, assessment2, assessment3]).then((values) => {
      const payload = {
        id: savedUser[0].id,
        email: savedUser[0].email,
        first_name: savedUser[0].first_name,
        last_name: savedUser[0].last_name
      };
      let token = jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '6h'})
      return {
        token: token,
        userId: savedUser[0].id,
        assessments: [...values]
      }
    })
  })
}
