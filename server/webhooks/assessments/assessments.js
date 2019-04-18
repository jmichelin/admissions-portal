const express = require('express');
const router = express.Router();
const Q = require('../../db/queries');

router.patch('/:id', (req, res, next) => {
  Q.updateAssessment(req.params.id, req.body.results, req.body.status)
    .then((updatedAssessment) => {
      res.send(updatedAssessment);
      return
    });
});



module.exports = router;
