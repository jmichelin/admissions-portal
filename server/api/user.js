const express = require('express');

const router = express.Router();

import Salesforce from '../lib/salesforce';

const salesforce = new Salesforce();

router.get('/', (req, res, next) => {
  // Look for contact, if contact update
  // If no contact, look for lead and update
  // If no contact or lead, create a lead with the following fields
  
  // salesforce.login().then(() => { 
  //   return salesforce.contactQuery(req.user.email);
  // }).then(contactResponse => {
  //   if (contactResponse.records.length > 0) {
  //   } else {
  //     return salesforce.leadQuery(req.user.email);
  //   }
  // }).then(leadResponse => {
  //   if (leadResponse.records.length > 0) {
  //   } else {
  //     return salesforce.createlead(req.user.email);
  //   }
  // });

  salesforce.login()
    .then(() => {
      return salesforce.contactQuery(req.user.email);
    }).then(response => {
      if (response.records.length) {
        return salesforce.oppQuery(response.records[0].Account.Id)
        .then(opps => {
          let data = {};
          if (opps.length) {
            data.opportunities = opps;
            data.user = req.user;
            let scorecardIds = [];
            opps.forEach(opp => {
              if(opp.scorecardId) scorecardIds.push(opp.scorecardId);
            });
            return salesforce.scorecardQueries(scorecardIds)
              .then(scorecards => {
                data.opportunities.forEach(opp => {
                  scorecards.forEach(card => {
                    if (card.oppId === opp.id)  opp.scorecard = card;
                  });
                });
                res.json({
                  data: data
                });
              });
          } else {
            res.json({message: 'No Applications Exist for this User'});
          }
        });
      } else {
        res.json({message: 'No Applications Exist for this User'});
      }
    })
    .catch(err => {
      res.status(501);
      const error = new Error('Error retreiving applications.');
      next(error);
    });
});

router.post('/update-opp-stage', (req, res, next) => {
  salesforce.login()
    .then(() => {
        return salesforce.updateOppStage(req.body.oppId, req.body.stageName);
    }).then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(501);
      const error = new Error('Error updating opportunity.');
      next(error);
    });
});

router.post('/update-scorecard', (req, res, next) => {
  salesforce.login()
    .then(() => {
        return salesforce.updateScorecardMoveOn(req.body.scorecardId, req.body.moveForward);
    }).then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(501);
      const error = new Error('Error updating scorecard.');
      next(error);
    });
});

router.post('/code-submit', (req, res, next) => {
  salesforce.login()
    .then(() => {
        return salesforce.submitCodingChallenge(req.body.oppId, req.body.code, req.body.moveForward, req.body.stage);
    }).then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(501);
      const error = new Error('Error updating coding challenge.');
      next(error);
    });
});

router.post('/python-submit', (req, res, next) => {
  salesforce.login()
    .then(() => {
        return salesforce.submitPythonChallenge(req.body.oppId, req.body.code, req.body.moveForward, req.body.stage, req.body.pythonScore);
    }).then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(501);
      const error = new Error('Error updating coding challenge.');
      next(error);
    });
});


module.exports = router;
