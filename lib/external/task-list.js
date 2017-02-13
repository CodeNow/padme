'use strict'
const joi = require('joi')

module.exports = [{
  name: 'task.create',
  jobSchema: joi.object({
    testString: joi.string().required()
  }).unknown().required().label('task.create job data')
}]
