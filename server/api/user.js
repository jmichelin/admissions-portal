const express = require('express');
const router = express.Router();
import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();
const Q = require('../db/queries');
import Honeybadger from '../lib/honeybadger';
const honeybadger = new Honeybadger();

router.get('/', async (req, res, next) => {
  try {
    const userApplications = await Q.getUserApplications(req.user.id);
    userApplications.forEach(app => app.type = 'application');

    const data = { user: req.user, applications: userApplications };
    const opportunities = await salesforce.getOpportunities(req.user.email);
    data.applications = data.applications.concat(opportunities).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    res.json({ data });
  } catch(err) {
    console.log(err);
    honeybadger.notify(err);
    res.status(501);
    const error = new Error('Error retreiving applications.');
    next(error);
  }
});

router.post('/update-opp-stage', (req, res, next) => {
  salesforce.login()
    .then(() => {
        // return salesforce.updateOppStage(req.body.oppId, req.body.stageName);
        return;
    }).then(response => {
      res.send(response);
    })
    .catch(err => {
      honeybadger.notify(err);

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
      honeybadger.notify(err);
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
      honeybadger.notify(err);
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
      honeybadger.notify(err);
      res.status(501);
      const error = new Error('Error updating coding challenge.');
      next(error);
    });
});


module.exports = router;
