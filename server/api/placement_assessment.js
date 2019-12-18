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

// get new assessment object
router.get('/:userid', (req, res, next) => {
  let userID = req.params.userid;
  const assessmentObject = generateNewAssessmentObj(userID);

  // TODO might have to swap order of addNew and getPrompt
  Q.getPlacementAssessmentPrompt(1, [])
            .then((assessmentPrompt) => {
              console.log('assessmentPrompt' , assessmentPrompt)
              assessmentObject.assessmentResults.promptsUsed.push(assessmentPrompt);
              return Q.addNewPlacementAssessment(assessmentObject)
              .then(() => {res.json({assessmentObject})}) //)
              .catch((err) => {
                honeybadger.notify(err);
                res.status(501);
                const error = new Error('Error creating new placement assessment.');
                next(error);
              });
            })
            .catch((err) => {
              honeybadger.notify(err);
              res.status(501);
              const error = new Error('Error getting prompt.');
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

function calculateNextPromptLevel (skillLevel, numOfPrompts) {
  if ( numOfPrompts > 2 ) {
    if(skillLevel < 1.45 ) { // < 1.45 serve 1
      return 1
    } else if( skillLevel >= 1.45 && skillLevel < 1.85 ) { // >= 1.45 && < 1.85 serve 2
      return 2
    } else if (skillLevel >= 1.85 && skillLevel < 2.5) { // >= 1.85 < 2.5 serve 3
      return 3
    } else if (skillLevel >= 2.5) { // >= 2.5 serve 4 or 3
      return Math.floor( Math.random() * 2 + 3)
    }
  }
    return 1
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