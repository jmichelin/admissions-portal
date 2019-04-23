const express = require('express');
const router = express.Router();
const Q = require('../../db/queries');

router.patch('/:id', (req, res, next) => {
  if (req.query.token !== process.env.ASSESSMENTS_CALLBACK_TOKEN) {
    res.send(401)
    return
  }
  Q.updateAssessment(req.params.id, req.body.results, req.body.status)
    .then((updatedAssessment) => {
      res.send(updatedAssessment);
      return
    });
});



module.exports = router;
