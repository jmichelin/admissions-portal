const express = require('express');
const router = express.Router();
const Q = require('../db/queries');

import Honeybadger from '../lib/honeybadger';
const honeybadger = new Honeybadger();
import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();

// GET
  //getUnrankedPrompt
    // find unranked prompt of multiple choice type
    // return full record
router.get('/unranked', (req, res, next) => {
  Q.getUnrankedPlacementAssessmentPrompt()
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

router.get('/:userid', (req, res, next) => {
  let userID = req.params.userid;
  const assessmentObject = generateNewAssessmentObj(userID);
  Q.addNewPlacementAssessment(assessmentObject)
  .then(() => {
    // get prompt
    return Q.getPlacementAssessmentPrompt(1, [])
            .then((assessmentPrompt) => {
              console.log('assessmentPrompt' , assessmentPrompt)
              assessmentObject.assessmentResults.promptsUsed.push(assessmentPrompt);
              res.json({assessmentObject})
            })
            .catch((err) => {
              honeybadger.notify(err);
              res.status(501);
              const error = new Error('Error getting prompt.');
              next(error);
            });
  })
  .catch((err) => {
    honeybadger.notify(err);
    res.status(501);
    const error = new Error('Error creating new placement assessment.');
    next(error);
  });
});

// POST

router.post('/unranked', (req, res, next) => {
  let placementPrompt = {
    id: req.body.id,
    difficulty_rank: req.body.difficulty_rank
  };
  console.log(placementPrompt);
  Q.rankPlacementAssessmentPrompt(placementPrompt)
  .then(() => {
    res.json(placementPrompt)
  })
  .catch((err) => {
    honeybadger.notify(err);
    res.status(501);
    const error = new Error('Error ranking placement prompt.');
    next(error);
  });
});


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