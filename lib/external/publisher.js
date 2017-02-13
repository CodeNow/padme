'use strict'
const RabbitConnector = require('ponos/lib/rabbitmq')

const logger = require('logger.js')
const publishedEventList = require('external/published-events.js')
const taskList = require('external/task-list.js')

/**
 * Module in charge of rabbitmq connection and job publishing
 */
class Publisher extends RabbitConnector {
  constructor () {
    super({
      name: process.env.APP_NAME,
      log: logger.child({ module: 'publisher' }),
      hostname: process.env.RABBITMQ_HOSTNAME,
      port: process.env.RABBITMQ_PORT,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
      tasks: taskList,
      events: publishedEventList
    })
  }

  /**
   * @returns {Promise}
   * @resolves undefined when connected
   * @rejects Error if connection failed
   */
  start () {
    return this.connect()
  }
}

module.exports = new Publisher()
module.exports._Publisher = Publisher
