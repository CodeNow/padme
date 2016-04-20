'use strict'

const Hermes = require('./hermes.js')

/**
 * Subscribed events
 * @type Array
 */
const _subscribedEvents = [
  'event.tested'
]

/**
 * Subscribed queues
 * @type Array
 */
const _subscribeQueues = [
  'queue.test'
]

/**
 * Module in charge of rabbitmq subscriptions
 * @returns {Hernes} Hermes subscriber instance
 */
class Subscriber {
  constructor () {
    return new Hermes({
      subscribedEvents: _subscribedEvents,
      queues: _subscribeQueues
    })
  }
}

module.exports = new Subscriber()
