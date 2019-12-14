const express = require('express');
const router = express.Router();
const Q = require('../db/queries');

// import Assessments from '../lib/assessments'; TODO
import Honeybadger from '../lib/honeybadger';
const honeybadger = new Honeybadger();
import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();

// GET
router.get('/:userid', (req, res, next) => {
  let userID = req.params.userid;
  const assessmentObject = generateNewAssessmentObj(userID);
  Q.addNewPlacementAssessment(assessmentObject)
  .then(res.json({assessmentObject})) // TODO return populated object
  .catch((err) => {
    honeybadger.notify(err);
    res.status(501);
    const error = new Error('Error creating new placement assessment.');
    next(error);
  });
});

  //getUnrankedPrompt
    // find unranked prompt of multiple choice type
    // return full record
  router.get('/unranked', (req, res, next) => {
    Q.getUnrankedPlacementAssessment()
    .then((assessmentPrompt) => {
      res.json(assessmentPrompt);
    })
    .catch((err) => {
      honeybadger.notify(err);
      res.status(501);
      const error = new Error('Error fetching unranked prompt.');
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


function calculateCurrentSkillLevel(assessmentObject) { // TODO think about rating vs level
  // sum
    // assessmentResults.promptsUsed.difficultyRank + assessmentObject.skillLevel
      // divide by promptsUsed length
      // set new assessmentObject.skillLevel

}

function generateNewAssessmentObj (userId) {
  return {
    'userId': userId,
    'startDate': Date.now(),
    'lastUpdated': Date.now(),
    'skillLevel': 1,
    'assessmentResults': {
      'skillsCovered': [],
      'promptsUsed': []
    }
  }
}



module.exports = router;