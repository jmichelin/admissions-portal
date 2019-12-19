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
              assessmentObject.assessmentResults.promptsUsed.push(assessmentPrompt);
              return Q.addNewPlacementAssessment(assessmentObject)
              .then(() => {res.json({assessmentObject})})
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
  let placementPrompt = { // TODO change to const
    id: req.body.id,
    difficulty_rank: req.body.difficulty_rank
  };
  console.log(placementPrompt); // TODO remove
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
  router.post('/submitAnswer', (req, res, next) => {
    const promptAnswer = { // requires assessment id, answer and promptID
      assessmentID : req.body.assessmentID,
      promptID: req.body.promptID,
      answer: req.body.answerValue
    };
  // look up assessmentObject see getPlacementAssessmentPrompt
    // check answer against assessmentObject.assessmentResults.promptsUsed.id === promptAnswer.promptID
    // update assessmentObject.assessmentResults
      // calculateCurrentSkillLevel
      // calculateNextPromptLevel
      // Q.getPlacementAssessmentPrompt
        // Q.addNewPlacementAssessment
  });

// Utility Functions
// TODO Move to external library

function calcWeight(input) {
  const weights = {
    0 : 0,
    1 : .15,
    2: .35,
    3: .35,
    4:.15
  }
  return 1 + (input * weights[input])
}


function randomizeBetweenMaxMinusOne (max) {
  return Math.floor( Math.random() * 2 + (max - 1) )
}

// TODO change to passing in object and returning object
function calculateCurrentSkillLevel(skillLevel, answerValue, runningWeight, numOfPrompts) {
  var weight = calcWeight(answerValue);
  weight = weight + runningWeight;
  var newSkillLevel = weight / numOfPrompts;
  return { newSkillLevel, weight}
}

function calculateNextPromptLevel (skillLevel, numOfPrompts) {
  if ( numOfPrompts > 2 ) {
    if(skillLevel < 1.15 ) { // serve 1 0 2
      return randomizeBetweenMaxMinusOne(2);
    } else if( skillLevel >= 1.15 && skillLevel < 1.3 ) { // 2 or 3
      return randomizeBetweenMaxMinusOne(3);
    } else if (skillLevel >= 1.3 && skillLevel < 2.5) { // 2 or 3
      return randomizeBetweenMaxMinusOne(3);
    } else if (skillLevel >= 2.5) { // >= 2.5 serve 4 or 3
      return randomizeBetweenMaxMinusOne(4);
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
      'runningWeight': 0,
      'skillsCovered': [],
      'promptsUsed': []
    }
  }
}



module.exports = router;