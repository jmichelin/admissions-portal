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
        let user = {};
        user.contactId = response.records[0].Id;
        user.accountId = response.records[0].Account.Id;
        return salesforce.oppQuery(user.accountId)
        .then(opp => {
          if (opp.records.length) {
            res.send(opp.records);
          } else {
            res.send('No Applications Exist for this User');
            return;
          }
        });
      } else {
        res.send('No Applications Exist for this User');
        return;
      }
      res.json(response);
    })
    .catch(err => console.log(err));
});


module.exports = router;
