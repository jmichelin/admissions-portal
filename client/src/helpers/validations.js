import Joi from 'joi';

export default {
  "string": Joi.string(),
  "250-1500-chars": Joi.string().min(150).max(1500),
  "birthday": Joi.string().regex(/^((0|1)\d{1})\/((0|1|2)\d{1})\/((19|20)\d{2})/),
  "checked": Joi.boolean().valid(true)
};
