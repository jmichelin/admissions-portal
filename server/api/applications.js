const express = require('express');
const router = express.Router();
const Q = require('../db/queries');

router.patch('/', (req, res) => {
  const application = {
    course_type: req.body.course_product,
    course_product: req.body.course_product,
    values: req.body.values,
    complete: req.body.complete,
    user_id: req.user.id,
  };

  Q.updateApplication(application).then((savedApp) => {
    if (savedApp) return res.status(200).send(savedApp)

    return res.status(404).send({error: "application not found"})
  })
});

router.post('/initialize/type/:courseType/product/:courseProduct', (req, res) => {
  let courseType = decodeURI(req.params.courseType);
  let courseProduct = decodeURI(req.params.courseProduct);
  Q.findOrCreateApplication(courseType, courseProduct, req.user.id)
    .then((application) => res.status(200).send(application))
    .catch((err) => {
      console.log("Error initializing program:", err)
      return res.status(500).send(err)
    })
});

module.exports = router;
