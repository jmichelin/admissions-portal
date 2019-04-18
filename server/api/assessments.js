const express = require('express');

const router = express.Router();
const Q = require('../db/queries');

import { SNIPPET_1 } from '../constants';
import Assessments from '../lib/assessments';

const assessmentz = new Assessments();

router.post('/', (req, res, next) => {
 let assessment = {
   snippet_id: req.body.snippet_id,
   answer: req.body.answer,
   status: 'processing',
   test_results: '',
   user_id: req.user.id
 }
 Q.addNewAssessment(assessment)
    .then(savedAssessment => {
      let payload = {
        code_to_assess: assessment.answer,
        setup_to_run_before_code: '',
        tests_to_assess_against: SNIPPET_1.tests,
        language: 'python3.6',
        callback_url: `${process.env.BASE_URL}/api/v1/webhooks/${savedAssessment[0].id}`
      };

     assessmentz.post(payload)
      .then(thing => {
       res.send({id: savedAssessment[0].id});
       return;
     });
   });



});



module.exports = router;
