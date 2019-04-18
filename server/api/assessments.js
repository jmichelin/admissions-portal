const express = require('express');

const router = express.Router();
const Q = require('../db/queries');

import { SNIPPET_1 } from '../constants';
import Assessments from '../lib/assessments';

const assessmentz = new Assessments();

router.post('/', (req, res, next) => {
 let assessment = {
   snippet_id: 1,
   answer: 'test',
   status: 'processing',
   test_results: '',
   user_id: 1
 }
 Q.addNewAssessment(assessment)
    .then(result => {
      let assessmentsPayload = {
        code_to_assess: assessment.answer,
        setup_to_run_before_code: '',
        tests_to_assess_against: SNIPPET_1.tests,
        language: 'python3.6',
        callback_url: `${process.env.BASE_URL}/api/vi/assessments/webhook/${result[0].id}`
      };

     assessmentz.post(assessmentsPayload)
      .then(thing => {
        console.log('thing', thing);
        res.send(200).end();
      })
    })



});

router.patch('/webhook/:id', (req, res, next) => {
  console.log('****', req.body);
});



module.exports = router;
