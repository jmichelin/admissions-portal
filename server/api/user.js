const express = require('express');
require("@babel/register");

const router = express.Router();

import Salesforce from '../../client/src/lib/salesforce';

const salesforce = new Salesforce();

router.get('/', (req, res) => {
  //query salesforce to find contact if no contact return error
  salesforce.login()
    .then(() => {
      // check if there is a contact with this email
      return salesforce.contactQuery('murph@test.com');
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
            res.send('No Applications Exist for this User');
          }
        });
      } else {
        res.send('No Applications Exist for this User');
      }
    })
    .catch(err => console.log(err));
});


module.exports = router;
