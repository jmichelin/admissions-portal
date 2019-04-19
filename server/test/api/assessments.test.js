require('../test.setup')();
const request = require('supertest');
const Q = require('../../db/queries');
const jwt = require('jsonwebtoken');

describe('api assessments', () => {
  let sandbox;
  let app;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
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
            if (err) return done(err);
            expect(res.body).to.eq({error: 'You already are running a test!'})
            done();
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
      user_id: savedUser.id
    }
    return Q.addNewAssessment(assessment).then(() => {
      const payload = {
        id: savedUser.id,
        email: savedUser.email,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name
      };
      jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '6h'}, (err, token) => {
        return token
      });
    })
  })
}
