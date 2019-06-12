require('../test.setup')();
require('dotenv').config();
const request = require('supertest');
const knex = require('../../../server/db/knex');
const Testing = require('../test.helpers');
import Salesforce from '../../lib/salesforce';

const contactQuery = { records: [{ Account: { Id: 1 } }] };
const emptyContactQuery = { records: [] };
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
    knex.raw('start transaction').then(() => { done(); });
  });

  afterEach((done) => {
    sandbox.restore();
    knex.raw('rollback').then(() => { done(); });
  });

  describe('GET api/v1/user', () => {
    it('gives user details, sf opportunities, and applications', async () => {
      const user = await Testing.userWithApplication('neat course type', 'neat course product');

      sandbox.stub(Salesforce.prototype, 'getOpportunities').resolves([{
        id: 999,
        course_product: 'neat course product 2',
        course_type: 'neat course type 2',
        values: {},
        complete: null,
        user_id: 1296,
        created_at: new Date(),
        updated_at: new Date(),
        type: 'opportunity'
      }]);

      const res = await request(app)
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${user.token}`)
        .send()
        .expect(200)
      const userRes = res.body.data.user;
      const opp = res.body.data.applications[0];
      const application = res.body.data.applications[1];

      expect(opp.id).to.eq(999);
      expect(opp.course_product).to.eq('neat course product 2');
      expect(opp.course_type).to.eq('neat course type 2');
      expect(opp.type).to.eq('opportunity');
      expect(userRes.first_name).to.eq('F');
      expect(userRes.last_name).to.eq('L');
      expect(userRes.email).to.eq('lf@example.com');
      expect(application.id).to.eq(user.application.id);
      expect(application.courseType).to.eq(user.application.courseType);
      expect(application.courseProduct).to.eq(user.application.courseProduct);
    });
  });

  it('returns applications even when salesforce returns no opportunities', async () => {
    sandbox.stub(Salesforce.prototype, 'getOpportunities').resolves([]);

    const user = await Testing.userWithApplication('neat course type', 'neat course product');
    const res = await request(app)
      .get('/api/v1/user')
      .set('Authorization', `Bearer ${user.token}`)
      .send()
      .expect(200)
    const application = res.body.data.applications[0];
    
    expect(res.body.data.applications.length).to.eq(1);
    expect(res.body.data.opportunities).to.eq(undefined);
    expect(application.id).to.eq(user.application.id);
    expect(application.courseType).to.eq(user.application.courseType);
    expect(application.courseProduct).to.eq(user.application.courseProduct);
  });
});
