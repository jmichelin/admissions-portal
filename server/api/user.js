const express = require('express');
require("@babel/register");

const router = express.Router();

import Salesforce from '../../client/src/lib/salesforce';

const salesforce = new Salesforce();

router.get('/', (req, res) => {
  //query salesforce to find contact if no contact return error
  salesforce.login()
    .then(() => {
      // check if there is already a lead with this email
      return salesforce.contactQuery('murph@test.com');
    }).then(response => {
      console.log(response);
      res.json(response);
    })
    .catch(err => console.log(err))
});


module.exports = router;
