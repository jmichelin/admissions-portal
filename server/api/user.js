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
        .then(opp => {
          if (opp.records.length) {
            let opp = {};
            opp.contactId = response.records[0].Id;
            opp.accountId = response.records[0].Account.Id;
            opp.stage = response.records[0].StageName,
            opp.courseProduct = response.records[0].Course_Product__c,
            opp.courseType = response.records[0].Course_Type__c,
            opp.createdDate = response.records[0].CreatedDate
          
            res.send(opp);
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
