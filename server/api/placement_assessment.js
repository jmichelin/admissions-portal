const express = require('express');
const router = express.Router();
const Q = require('../db/queries');

// import Assessments from '../lib/assessments'; TODO
import Honeybadger from '../lib/honeybadger';
const honeybadger = new Honeybadger();
import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();

// GET
router.get('/:userid', (req, res, next) => { // new assessment
  // requires user info
  let userID = req.params.userid; // TODO maybe switch to email
  const assessmentObject = generateNewAssessmentObj(userID); // getNewAssessmentObject
  // add intial record to db
  Q.addNewPlacementAssessment(assessmentObject)
  .then(res.json({assessmentObject})) // TODO; // return populated object
  .catch((err) => {
    honeybadger.notify(err);
    res.status(501);
    const error = new Error('Error creating new placement assessment.');
    next(error);
  });
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



function generateNewAssessmentObj (userId) {
  return {
    'userId': userId,
    'startDate': Date.now(),
    'lastUpdated': Date.now(),
    'assessmentResults': {
      'skillsCovered': [],
      'promptsUses': []
    }
  }
}



module.exports = router;