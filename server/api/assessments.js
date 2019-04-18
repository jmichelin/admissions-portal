const express = require('express');

const router = express.Router();
const Q = require('../db/queries');

import { SNIPPET_1, SNIPPET_2 } from '../constants';
import Assessments from '../lib/assessments';

const assessmentService = new Assessments();

router.post('/', noRunningTests, (req, res, next) => {
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
        tests_to_assess_against: snippet_tests(assessment.snippet_id),
        language: 'python3.6',
        callback_url: `${process.env.BASE_URL}/webhooks/assessments/${savedAssessment[0].id}`
      };

     assessmentService.post(payload)
      .then(thing => {
       res.json({id: savedAssessment[0].id});
       return;
     });
   });
});

router.get('/:id', (req, res) => {
  Q.getAssessment(req.params.id)
    .then((assessment) => {
      if (assessment === undefined || assessment.user_id !== req.user.id) {
        res.send(401);
      } else {
        res.json(assessment)
      }
      return
    })
});

router.patch('/:id/cancel', (req, res) => {
  Q.getAssessment(req.params.id)
    .then((assessment) => {
      if (assessment.user_id !== req.user.id) {
        return res.send(401);
      } else {
        Q.updateAssessment(req.params.id, 'Tests canceled', 'canceled').then((canceled) => {
          return res.json(canceled)
        })
      }
    })
});

function noRunningTests(req, res, next) {
  Q.getProcessingAssessments(req.user.id)
    .then((processing) => {
      if (processing.length > 0 && processing[0].count > 0) {
        Q.errorOutStaleAssessments(req.user.id).then(() => {
          return res.status(401).send({error: 'You already are running a test!'})
        })
      } else {
        next()
      }
    })
}

function snippet_tests(snippet_id) {
  if (snippet_id === 1) {
    return SNIPPET_1.tests
  } else if (snippet_id === 2) {
    return SNIPPET_2.tests
  }
  return ''
}

module.exports = router;
