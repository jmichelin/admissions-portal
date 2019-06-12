const express = require('express');
const router = express.Router();
const Q = require('../db/queries');

import { SNIPPET_1, SNIPPET_2 } from '../constants';
import Assessments from '../lib/assessments';

router.get('/user', (req, res) => {
  Q.getUserLatestAssessment(req.user.id)
    .then((latestAsessments) => res.json(latestAsessments))
    .catch(() => {
      res.status(501);
      const error = new Error('Error getting latest assessements.');
      next(error);
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
    .catch(() => {
      res.status(501);
      const error = new Error('Error getting assessment.');
      next(error);
    });
});

router.patch('/:id/cancel', (req, res) => {
  Q.getAssessment(req.params.id)
    .then((assessment) => {
      if (assessment.user_id !== req.user.id) {
        return res.send(401);
      } else {
        Q.updateAssessment(req.params.id, 'Tests canceled', 'canceled')
          .then(canceled => res.json(canceled))
      }
    })
    .catch(() => {
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
        .catch(() => {
          res.status(501);
          const error = new Error('Error calling Asessment Service.');
          next(error);
        });
   })
   .catch(() => {
     res.status(501);
     const error = new Error('Error saving assessment.');
     next(error);
   });
});

function noRunningTests(req, res, next) {
  Q.getProcessingAssessments(req.user.id)
    .then((processing) => {
      if (processing.length > 0 && processing[0].count > 0) {
        Q.errorOutStaleAssessments(req.user.id).then(() => {
          return res.status(401).send({ error: 'You already are running a test!' })
        })
      } else {
        next()
      }
    })
    .catch(() => {
      res.status(501);
      const error = new Error('Error clearing out stale running tests.');
      next(error);
    });
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
