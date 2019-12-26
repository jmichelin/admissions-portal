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
    .then((insertedAssessment) => {
      console.log(insertedAssessment);
      assessmentObject.id = insertedAssessment[0].id;
      res.json({assessmentObject})
    })
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
    // get latest from db
    Q.getUserPlacementAssessment(promptAnswer.assessmentID)// look up assessmentObject
    .then((assessmentObject) => {
      //console.log('assessment object', assessmentObject);
      // check answer against assessmentObject.assessmentResults.promptsUsed[].id === promptAnswer.promptID
        var promptsUsed = assessmentObject[0].result.promptsUsed;
        var currentPrompt = promptsUsed[promptsUsed.length - 1 ];
        var isCorrectAnswer = currentPrompt.content.choices[promptAnswer.answer].isAnswer;
      // update assessmentObject.results
        // console.log('current prompt ', currentPrompt);
        currentPrompt["isCorrect"] = isCorrectAnswer;
      // calculateCurrentSkillLevel
        var skillLevel = assessmentObject[0].result.skillLevel;
        var answerValue = currentPrompt.difficulty_rank;
        var runningWeight = assessmentObject[0].result.runningWeight;
        var numOfPrompts = assessmentObject[0].result.promptsUsed.length;
        var newSkillLevel = calculateCurrentSkillLevel(skillLevel, answerValue, runningWeight, numOfPrompts);
        //console.log('newSkillLevel ', newSkillLevel);
        skillLevel = newSkillLevel.newSkillLevel;
        runningWeight = newSkillLevel.weight;
      // calculateNextPromptLevel
        var nextPromptLevel = calculateNextPromptLevel(skillLevel, numOfPrompts);
        //console.log('nextPromptLevel ', nextPromptLevel);
        // update assessmentObject
        assessmentObject[0].result.skillLevel = skillLevel;
        assessmentObject[0].result.runningWeight = runningWeight;
        //
        Q.getPlacementAssessmentPrompt(nextPromptLevel, promptsUsed)
        .then((assessmentPrompt) => {
          assessmentObject[0].result.promptsUsed.push(assessmentPrompt);
          //console.log('should have next prompt in object ', assessmentObject[0]);
          Q.updatePlacementAssessment(assessmentObject[0])
          .then((assessmentObject) => {
            //console.log('after update assessment object ',assessmentObject);
            res.json(assessmentObject);
          })
          .catch((err) => {
            honeybadger.notify(err);
            res.status(501);
            const error = new Error('Error updating placement attempt.');
            next(error);
          });
        })
        .catch((err) => {
          honeybadger.notify(err);
          res.status(501);
          const error = new Error('Error getting placement prompt.');
          next(error);
        }); // TODO need to add throws
    })
    .catch((err) => {
      honeybadger.notify(err);
      res.status(501);
      const error = new Error('Error getting user assessment.');
      next(error);
    });
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
    'assessmentResults': {
      'skillLevel': 1,
      'runningWeight': 0,
      'skillsCovered': [],
      'promptsUsed': []
    }
  }
}



module.exports = router;