require('dotenv').config();
const Q = require('../db/queries');
const jwt = require('jsonwebtoken');
const knex = require('../../server/db/knex');

class Testing {
  static testUser() {
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

  static userWithProcessingAssessment() {
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

  static userWithThreeAssessments() {
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
}

module.exports = Testing;
