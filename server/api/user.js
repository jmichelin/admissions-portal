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
        let user = {}
        user.contactId = response.records[0].Id;
        user.accountId = response.records[0].Account.Id;
        user.accountName = response.records[0].Account.Name;
        return salesforce.oppQuery(user.accountId)
        .then(opp => {
          if (opp.records.length) {
            res.json(opp.records);
          } else {
            console.log('No opp exists');
            return;
          }
        })
      } else {
        console.log('No contact exists');
        return;
      }
      res.json(response);
    })
    .catch(err => console.log(err))
});


module.exports = router;
