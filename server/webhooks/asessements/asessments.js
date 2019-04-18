const express = require('express');
const router = express.Router();


router.patch('/:id', (req, res, next) => {
  console.log('****', req.body);
  res.send(req.body);
  return;
});



module.exports = router;
