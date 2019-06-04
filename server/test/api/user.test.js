require('../test.setup')();
require('dotenv').config();
const request = require('supertest');
const knex = require('../../../server/db/knex');
const Testing = require('../test.helpers');
import Salesforce from '../../lib/salesforce';

const contactQuery = { records: [{ Account: { Id: 1 } }] };
const oppQueryResult = [{
  id: '006n0000008k9kBAAQ',
  name: 'Elegant Doilies 19-09-WD-AUS Application',
  campus: 'Austin-2nd Street District',
  courseProduct: 'Web Development',
  courseStart: '2019-07-15',
  createdDate: '2019-06-03T22:48:42.000+0000',
  courseType: '12 Week Full-Time Immersive',
  productCode: '19-09-WD-AUS',
  scorecardId: 'a0Kn00000024iAyEAI',
  stage: 'New',
}];
const scoreCardQueriesResult = [{
  finalCode: null,
  moveForwardCode: null,
  oppId: '006n0000008k9kBAAQ',
  moveForwardInterview: null,
}];

describe('api users', () => {
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

  describe('GET api/v1/user', () => {
    it("yields only the user's latest assessment for a given snippet id", async () => {
      const user = await Testing.userWithApplication('neat course type', 'neat course product');

      sandbox.stub(Salesforce.prototype, 'login').resolves(true);
      sandbox.stub(Salesforce.prototype, 'contactQuery').resolves(contactQuery);
      sandbox.stub(Salesforce.prototype, 'oppQuery').resolves(oppQueryResult);
      sandbox.stub(Salesforce.prototype, 'scorecardQueries').resolves(scoreCardQueriesResult);

      const res = await request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${user.token}`)
        .send()
        .expect(200)
      const opp = res.body.data.opportunities[0];
      const userRes = res.body.data.user;

      expect(opp.id).to.eq('006n0000008k9kBAAQ');
      expect(opp.courseProduct).to.eq('Web Development');
      expect(opp.courseType).to.eq('12 Week Full-Time Immersive');
      expect(opp.scorecard.finalCode).to.eq(null);
      expect(opp.scorecard.moveForwardCode).to.eq(null);
      expect(opp.scorecard.oppId).to.eq('006n0000008k9kBAAQ');
      expect(opp.scorecard.moveForwardInterview).to.eq(null);
      expect(userRes.first_name).to.eq('F');
      expect(userRes.last_name).to.eq('L');
      expect(userRes.email).to.eq('lf@example.com');
    });
  });

});
