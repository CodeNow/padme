'use strict'
require('loadenv')()
const Code = require('code')
const Lab = require('lab')
const Promise = require('bluebird')
const sinon = require('sinon')

const taskCreateWorker = require('../../../lib/workers/task.create.js')
const workerServer = require('../../../lib/external/worker-server.js')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('worker-server.js unit test', () => {
  describe('module properties', () => {
    it('should expose start', (done) => {
      expect(workerServer.start).to.be.a.function()
      done()
    })

    it('should have populated tasks', (done) => {
      expect(workerServer._tasks).to.be.an.object()
      done()
    })

    it('should have populated events', (done) => {
      expect(workerServer._events).to.be.an.object()
      done()
    })

    describe('_requireWorkers', () => {
      beforeEach((done) => {
        sinon.stub(taskCreateWorker.prototype, 'run')
        done()
      })

      afterEach((done) => {
        taskCreateWorker.prototype.run.restore()
        done()
      })

      it('should define workers correctly', (done) => {
        workerServer._tasks.get('task.create')()
        sinon.assert.calledOnce(taskCreateWorker.prototype.run)
        done()
      })
    }) // end _requireWorkers
  }) // end module properties
}) // end worker-server.js unit test
