const express = require('express');

const router = express.Router();
const Q = require('../db/queries');

import Assessments from '../lib/assessments';


router.post('/', (req, res, next) => {
 let assessment = {
   snippet_id: 1,
   answer: 'test',
   status: 'processing',
   test_results: '',
   user_id: 1
 }
 Q.addNewAssessment(assessment)
    .then(result => {
      console.log(result);
    })



});



module.exports = router;
