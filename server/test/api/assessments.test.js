require('../test.setup')();
require('dotenv').config();
const Q = require('../../db/queries');
const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('api assessments', () => {
  let sandbox;
  let app;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    //sandbox.stub(console, 'log');
    app = require('../../index');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('POST api/v1/assessments', () => {
    it('responds "You already are running a test!" if a test is processing', (done) => {
      userWithProcessingAssessment().then((token) => {
        request(app)
          .post('/api/v1/assessments')
          .set('Authorization', `Bearer ${token}`) 
          .send({"snippet_id": 1,"answer": "def dogs"})
          .expect(401)
          .end((err, res) => {
            Q.cleanupTestUsers().then(() => {
              if (err) return done(err);
              expect(res.body.error).to.eq('You already are running a test!')
              done();
            })
          });
      })
    });
  });
});

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
    return Q.addNewAssessment(assessment).then(() => {
      const payload = {
        id: savedUser[0].id,
        email: savedUser[0].email,
        first_name: savedUser[0].first_name,
        last_name: savedUser[0].last_name
      };
      return jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '6h'});
    })
  })
}
