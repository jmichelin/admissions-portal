const express = require('express');

const router = express.Router();
const Q = require('../db/queries');

router.get('/', (_req, res) => {
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

router.get('/:campus', (req, res) => {
  Q.getCampus(decodeURI(req.params.campus))
    .then((course) => {
      if (course === undefined) {
        res.send(401);
      } else {
        res.json(course)
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
