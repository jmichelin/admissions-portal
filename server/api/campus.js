const express = require('express');

const router = express.Router();
const Q = require('../db/queries');

router.get('/', (_req, res, next) => {
  Q.getCampuses()
    .then((courses) => {
      if (courses === undefined) {
        res.send(401);
      } else {
        res.json(courses)
      }
      return
    })
    .catch(err => {
      res.status(501);
      const error = new Error('Error getting courses.');
      next(error);
    });
});

router.get('/:campus', (req, res, next) => {
  Q.getCampus(decodeURI(req.params.campus))
    .then((campus) => {
      if (campus === undefined) {
        res.send(404);
      } else {
        res.json(campus.offerrings)
      }
      return
    })
    .catch(err => {
      res.status(501);
      const error = new Error('Error getting course.');
      next(error);
    });
});

module.exports = router;
