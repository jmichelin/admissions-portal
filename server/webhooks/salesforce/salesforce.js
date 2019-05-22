const express = require('express');

const router = express.Router();
const Q = require('../../db/queries');

router.post("/", (req, _res, _next) => {
  let sfCampusesWithOfferrings = req.body;

  sfCampusesWithOfferrings.forEach( campus => {
    if (campus.campus != null) {
      return Q.getCampus(campus.campus).then((foundCampus)=>{
        if (foundCampus !== undefined) {
          return Q.updateCampus(campus);
        } else {
          return Q.createCampus(campus);
        }
      }).catch(error => {
        console.log(error);
      });
    }
  });
});

module.exports = router;
