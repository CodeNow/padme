/**
 * @module lib/workers/container-life-cycle-started
 */
'use strict'

const Promise = require('bluebird')
const TaskFatalError = require('ponos').TaskFatalError
const logger = require('../logger.js')

module.exports = (job) => {
  const log = logger.child({ job: job })
  return Promise
    .try(() => {
      Joi.assert(job, Joi.Object({
        from: Joi.string().required()
      }))
    })
    .catch((err) => {
      log.error('invalid job')
      throw TaskFatalError('invalid job', { job: job, err: err })
    })
    .then(() => {
      log.trace('got job')
    })
}
