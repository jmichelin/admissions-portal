const express = require('express');

const router = express.Router();
const Q = require('../db/queries');

router.post('/', (req, res, next) => {
  let application = {
    program: req.body.program,
    values: req.body.values,
    complete: req.body.complete,
    user_id: req.user.id,
  };
  Q.addApplication(application).then((savedApp) => {
    res.status(200).send(savedApp)
  })
});

module.exports = router;
