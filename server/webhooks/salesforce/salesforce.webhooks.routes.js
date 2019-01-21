'use strict';

import express from 'express';

import basicAuth from '../../../middleware/basic-auth.middleware';
import sfController from './salesforce.webhooks.controller';

var router = express.Router();

router.post('/courses', basicAuth.verifyHeaders, sfController.sfCoursesHandler);

export default router;
