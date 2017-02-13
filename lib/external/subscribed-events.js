'use strict'
const joi = require('joi')

module.exports = [{
  name: 'event.received',
  joiSchema: joi.object({
    testString: joi.string().required()
  }).unknown().required().label('event.received job data')
}]

