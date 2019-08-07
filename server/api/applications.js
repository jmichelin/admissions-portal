const express = require('express');
const router = express.Router();
const Q = require('../db/queries');
import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();
import Honeybadger from '../lib/honeybadger';
const honeybadger = new Honeybadger();

router.patch('/:id', async (req, res) => {
  const application = {
    id: req.params.id,
    values: req.body.values,
    courseType: req.body.courseType,
    courseProduct: req.body.courseProduct,
    complete: req.body.complete,
    user_id: req.user.id,
  };

  if (req.body.course_type) application.course_type = req.body.course_type;

  const completed = !!req.body.complete;

  try {
    const savedApp = await Q.updateApplication(application);

    if (savedApp) {
      await salesforce.login();
      await salesforce.applicationStepUpdate(req.user, application, completed);
      if (completed) await Q.updateSalesforceUserAttrs(req.user.email, null)
      return res.status(200).send(savedApp);
    }

    return res.status(404).send({ error: 'application not found' })
  } catch(err) {
    console.log(err)
    honeybadger.notify(err);
    return res.status(500).send({error: "Internal Server Error"})
  }
});

router.delete('/:id', async (req, res) => {
  if (req.user.id !== req.body.applicationUserID) return res.status(401);

  try {
    await Q.deleteApplication(req.params.id);
    return res.json({ message: `Successfully deleted application ${req.params.id}` });
  } catch (err) {
    console.log(err);
    honeybadger.notify(err);
    return res.status(500);
  }
});

router.post('/initialize/type/:courseType/product/:courseProduct', async (req, res) => {
  let courseType = decodeURI(req.params.courseType);
  let courseProduct = decodeURI(req.params.courseProduct);

  try {
    await salesforce.login();
    let user = await Q.getUserbyEmail(req.user.email); // Could be a stale user object (saleforce user updated)
    const application = await Q.findOrCreateApplication(courseType, courseProduct, user.id, req.body);
    await salesforce.applicationStepUpdate(user, application, false);
    return res.status(200).send(application)
  } catch (err) {
    console.log("Error initializing program:", err)
    honeybadger.notify(err);
    return res.status(500).send(err)
  }
});

module.exports = router;
