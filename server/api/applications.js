const express = require('express');
const router = express.Router();
const Q = require('../db/queries');

router.patch('/:id', async (req, res) => {
  const application = {
    id: req.params.id,
    values: req.body.values,
    courseType: req.body.courseType,
    courseProduct: req.body.courseProduct,
    complete: req.body.complete,
    user_id: req.user.id,
  };

  try {
    let savedApp = await Q.updateApplication(application)
    if (savedApp) return res.status(200).send(savedApp)
    return res.status(404).send({error: "application not found"})

  } catch(err) {
    console.log(err)
    return res.status(500)
  }
});

router.post('/initialize/type/:courseType/product/:courseProduct', (req, res) => {
  let courseType = decodeURI(req.params.courseType);
  let courseProduct = decodeURI(req.params.courseProduct);
  Q.findOrCreateApplication(courseType, courseProduct, req.user.id, req.body)
    .then((application) => res.status(200).send(application))
    .catch((err) => {
      console.log("Error initializing program:", err)
      return res.status(500).send(err)
    })
});

module.exports = router;
