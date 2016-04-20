'use strict'
require('loadenv')()

const PonosServer = require('ponos').Server

const log = require('../logger').child({ module: 'worker/server' })
const subscriber = require('./subscriber.js')

const tasks = {
  'container.life-cycle.started': require('../workers/container-life-cycle-started.js')
}

/**
 * The ponos server.
 * @type {ponos~WorkerServer}
 * @module worker-server
 */
class WorkerServer {
  constructor () {
    this._server = new PonosServer({
      hermes: subscriber,
      queues: Object.keys(tasks)
    })
    this._server.setAllTasks(tasks)
  }
}

module.exports = new WorkerServer()
