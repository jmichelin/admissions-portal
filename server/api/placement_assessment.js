const express = require('express');
const router = express.Router();
const Q = require('../db/queries');

// import Assessments from '../lib/assessments'; TODO
import Honeybadger from '../lib/honeybadger';
const honeybadger = new Honeybadger();
import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();

// GET
router.get('/:id', (req, res, next) => {
      // getNewAssessmentObject
    // requires user info
    // add intial record to db
    // return populated object
  // let userID = decodeURI(req.params.userid); // TODO maybe switch to email
  const assessmentObject = generateNewAssessmentObj();
  res.json({test:assessmentObject});
});

// POST
  // submitPromptAnswer
    // requires assessment id
    // record answer in assessmentObject
      // copy current prompt content
      // if passed add skill to skills array
    // update json in assessment attempt db table
    // calculate new skill level
    // request prompt based on skill level
    // return new prompt



function generateNewAssessmentObj (userid) {
  return {
    'userid': userid,
    'assessmentResults': {
      'skillsCovered': [],
      'promptsUses': []
    }
  }
}



module.exports = router;