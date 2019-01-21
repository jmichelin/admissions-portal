'use strict';

import Honeybadger from '../../../lib/honeybadger';
import status from '../../../lib/status';
import Salesforce from '../lib/salesforce';

const honeybadger = new Honeybadger();

export default {
  sfCoursesHandler: sfCoursesHandler
}

function sfCoursesHandler(req, res) {
  let salesforce = new Salesforce();
  let sfCampuses = req.body;

  salesforce.updateDBCourses(sfCampuses)
    .then( () => {
      salesforce.updateApplicationCourses(sfCampuses)
    })
    .then(() => {
      res.status(200).send(status.ok('Successfully updated courses from Salesforce.'));
    })
    .catch(err => {
      honeybadger.notify(err);
      res.status(400).send(err.toString());
    })
}
