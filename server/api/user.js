const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  //query salesforce to find contact if no contact return error
  this.salesforce.login()
    .then(() => {
      // check if there is already a lead with this email
      return this.salesforce.contactQuery('murph@test.com');
    }).catch(err => console.log(err))
  res.json([]);
});


module.exports = router;
