const express = require('express');
const router = express.Router();
import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();
const Q = require('../db/queries');

router.get('/', async (req, res, next) => {
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

  try {
    const userApplications = await Q.getUserApplications(req.user.id);
    userApplications.forEach(app => app.type = 'application');

    const data = { user: req.user, applications: userApplications };

    await salesforce.login();

    const response = await salesforce.contactQuery(req.user.email);
    if (!response.records.length) return res.json({ data });

    let opps = await salesforce.oppQuery(response.records[0].Account.Id)
    if (!opps.length) return res.json({ data });

    let scorecardIds = opps.filter(opp => opp.scorecardId).map(opp => opp.scorecardId)
    let scorecards = await salesforce.scorecardQueries(scorecardIds);

    const opportunities = opps.map(opp => {
      let card = scorecards.find(card => card.oppId === opp.id);
      if (card) opp.scorecard = card
      return opp
    }).filter(val => val)

    data.applications = data.applications.concat(opportunities).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    res.json({ data });
  } catch(err) {
    console.log(err);
    res.status(501);
    const error = new Error('Error retreiving applications.');
    next(error);
  }
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
