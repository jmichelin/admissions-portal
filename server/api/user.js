const express = require('express');

const router = express.Router();

import Salesforce from '../lib/salesforce';

const salesforce = new Salesforce();

router.get('/', (req, res) => {
  //query salesforce to find contact if no contact return error
  salesforce.login()
    .then(() => {
      // check if there is a contact with this email
      return salesforce.contactQuery(req.user.email);
    }).then(response => {
      if (response.records.length) {

        return salesforce.oppQuery(response.records[0].Account.Id)
        .then(opps => {
          if (opps.records.length) {
            res.json({
              opportunities: opps.records,
              user: req.user
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


router.post('/code-submit', (req, res, next) => {
  //query salesforce to find contact if no contact return error
  salesforce.login()
    .then(() => {
      return salesforce.updateCodingChallenge(req.body.oppId, req.body.code)
    }).then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
      res.status(501);
      const error = new Error('Error updating coding challenge.');
      next(error);
    });
});


module.exports = router;
