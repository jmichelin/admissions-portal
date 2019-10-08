const express = require('express');
const router = express.Router();
const Q = require('../db/queries');

import { PYTHON_TEST_1, PYTHON_TEST_2, PYTHON_TEST_3, PYTHON_TEST_4 } from '../constants';
import Assessments from '../lib/assessments';
import Honeybadger from '../lib/honeybadger';
const honeybadger = new Honeybadger();
import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();

router.get('/user', (req, res, next) => {
  Q.getUserLatestAssessment(req.user.id)
    .then((latestAsessments) => res.json(latestAsessments))
    .catch((err) => {
      honeybadger.notify(err);
      res.status(501);
      const error = new Error('Error getting latest assessements.');
      next(error);
    });
});

router.get('/:id', (req, res, next) => {
  Q.getAssessment(req.params.id)
    .then((assessment) => {
      if (assessment === undefined || assessment.user_id !== req.user.id) {
        res.send(401);
      } else {
        res.json(assessment)
      }
      return
    })
    .catch((err) => {
      honeybadger.notify(err);
      res.status(501);
      const error = new Error('Error getting assessment.');
      next(error);
    });
});

router.patch('/:id/cancel', (req, res, next) => {
  Q.getAssessment(req.params.id)
    .then((assessment) => {
      if (assessment.user_id !== req.user.id) {
        return res.send(401);
      } else {
        Q.updateAssessment(req.params.id, 'Tests canceled', 'canceled')
          .then(canceled => res.json(canceled))
      }
    })
    .catch((err) => {
      honeybadger.notify(err);
      res.status(501);
      const error = new Error('Error cancelling tests.');
      next(error);
    });
});


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
      const payload = {
        code_to_assess: assessment.answer,
        setup_to_run_before_code: '',
        tests_to_assess_against: snippet_tests(assessment.snippet_id),
        language: 'python3.6',
        callback_url: `${process.env.BASE_URL}/webhooks/assessments/${savedAssessment[0].id}?token=${process.env.ASSESSMENTS_CALLBACK_TOKEN}`
      };

      Assessments.post(payload)
        .then(() => {
          res.status(200).json({ id: savedAssessment[0].id });
          return;
        })
        .catch((err) => {
          honeybadger.notify(err);
          res.status(501);
          const error = new Error('Error calling Asessment Service.');
          next(error);
        });
   })
   .then(() => {
     salesforce.login()
     .then(() => {
       return salesforce.submitCodingChallenge(req.user.salesforce_id, req.body.oppId, req.body.code, req.body.moveForward, req.body.stage, 'Passed_Python_Challenge__c');
     })
   })
   .catch((err) => {
     honeybadger.notify(err);
     res.status(501);
     const error = new Error('Error running assessment.');
     next(error);
   });
});

function noRunningTests(req, res, next) {
  Q.getProcessingAssessments(req.user.id)
    .then((processing) => {
      if (processing.length > 0 && processing[0].count > 0) {
        Q.errorOutStaleAssessments(req.user.id).then(() => {
          res.status(401);
          const error = new Error('You are already running a test!');
          next(error)
        })
      } else {
        next()
      }
    })
    .catch((err) => {
      honeybadger.notify(err);
      res.status(501);
      const error = new Error('Error clearing out stale running tests.');
      next(error);
    });
}

function snippet_tests(snippet_id) {
switch(snippet_id) {
  case 1:
  return PYTHON_TEST_1
  break;
  case 2:
  return PYTHON_TEST_2
  break;
  case 3:
  return PYTHON_TEST_3
  break;
  case 4:
  return PYTHON_TEST_4
  default:
  return PYTHON_TEST_1
  }
}

module.exports = router;
