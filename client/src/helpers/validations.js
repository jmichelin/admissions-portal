import Joi from 'joi';

export default {
  "string": Joi.string().required(),
  "250-1500-chars": Joi.string().min(250).max(1500).required(),
  "birthday": Joi.string().regex(/^((0|1)\d{1})\/((0|1|2)\d{1})\/((19|20)\d{2})/).required(),
  "checked": Joi.boolean().valid(true).required()
}
