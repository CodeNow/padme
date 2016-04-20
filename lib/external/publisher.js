'use strict'

const Joi = require('joi')

const Hermes = require('./hermes.js')
const log = require('../logger.js')()

/**
 * Published events
 * @type Array
 */
const _publishedEvents = [
  'event.tested'
]

/**
 * Published queues
 * @type Array
 */
const _publishQueues = [
  'queue.test'
]

/**
 * Module in charge of rabbitmq connection
 *  client and pubSub are singletons
 */
class Publisher {
  constructor () {
    this._publisher = new Hermes({
      publishedEvents: _publishedEvents,
      queues: _publishQueues
    })
  }

  /**
   * Initiate connection to publisher server
   * @returns {Promise}
   * @resolves undefined when connected
   * @rejects Error if connection failed
   */
  start () {
    return this._publisher.connectAsync()
  }

  /**
   * publish event.tested
   * @param  {Object} data data to pass to job
   * @throws {Error} If missing data
   */
  publishEventTested (data) {
    log.info({ data: data }, 'publisher.publishEventTested')
    Joi.assert(data, Joi.object({
      id: Joi.string().required()
    }))
    this._publisher.publish('event.tested', data)
  }

  /**
   * publish queue.test
   * @param  {Object} data data to pass to job
   * @throws {Error} If missing data
   */
  publishQueueTest (data) {
    log.info({ data: data }, 'publisher.publishQueueTest')
    Joi.assert(data, Joi.object({
      msg: Joi.string().required()
    }))
    this._publisher.publish('queue.test', data)
  }
}

module.exports = new Publisher()
