const express = require('express');

const router = express.Router();

router.post('/', (req, res, next) => {
  console.log(req.body)
  res.status(200).send(req.body)
});

module.exports = router;
