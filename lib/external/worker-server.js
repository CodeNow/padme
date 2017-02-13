'use strict'
require('loadenv')()
const PonosServer = require('ponos').Server

const logger = require('../logger')
const subscribedEventList = require('./subscribed-events.js')
const taskList = require('./task-list.js')

/**
 * The ponos server.
 * @type {ponos~WorkerServer}
 * @module worker-server
 */
class WorkerServer extends PonosServer {
  constructor () {
    super({
      name: process.env.APP_NAME,
      log: logger.child({ module: 'worker/server' }),
      rabbitmq: {
        channel: {
          prefetch: process.env.WORKER_PREFETCH
        },
        hostname: process.env.RABBITMQ_HOSTNAME,
        port: process.env.RABBITMQ_PORT,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD
      },
      tasks: WorkerServer._getTasksObject(),
      events: WorkerServer._getEventsObject()
    })
  }

  /**
   * @return {Object}
   */
  static _getTasksObject () {
    return WorkerServer._requireWorkers(taskList)
  }

  /**
   * @return {Object}
   */
  static _getEventsObject () {
    return WorkerServer._requireWorkers(subscribedEventList)
  }

  /**
   * @param {String[]} workerNames
   * @return {Object}
   */
  static _requireWorkers (workerList) {
    const out = workerList.reduce((outObject, workerInfo) => {
      const Worker = require('../workers/' + workerInfo.name)

      outObject[workerInfo.name] = {
        _Worker: Worker,

        jobSchema: workerInfo.jobSchema,

        task: (job) => {
          return new Worker(job).run()
        }
      }
      return outObject
    }, {})
    return out
  }
}

module.exports = new WorkerServer()
