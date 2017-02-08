'use strict'
const Code = require('code')
const Lab = require('lab')
const monitorDog = require('monitor-dog')
const Promise = require('bluebird')
const sinon = require('sinon')

const workerDef = require('workers/task.create.js')
const publisher = require('external/publisher.js')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()
const Worker = workerDef._Worker

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('task.create worker unit test', () => {
  let testJob

  beforeEach((done) => {
    testJob = {
      job: 'job'
    }
    done()
  })

  describe('workerDef', () => {
    beforeEach((done) => {
      sinon.stub(workerDef._Worker.prototype, 'run')
      done()
    })

    afterEach((done) => {
      workerDef._Worker.prototype.run.restore()
      done()
    })

    it('should call run', (done) => {
      workerDef.task()
      sinon.assert.calledOnce(workerDef._Worker.prototype.run)
      done()
    })
  }) // end workerDef

  describe('constructor', () => {
    it('should set job and logger', (done) => {
      const worker = new Worker(testJob)

      expect(worker.job).to.equal(testJob)
      expect(worker.log).to.exist()
      done()
    })
  }) // end constructor

  describe('methods', () => {
    let worker

    beforeEach((done) => {
      worker = new Worker(testJob)
      done()
    })

    describe('run', () => {
      beforeEach((done) => {
        sinon.stub(worker, '_sendMetricData').resolves()
        sinon.stub(worker, '_publishEvent').resolves()
        done()
      })

      it('should call metric and publish commands', (done) => {
        worker.run().then(() => {
          sinon.assert.calledOnce(worker._sendMetricData)
          sinon.assert.calledOnce(worker._publishEvent)
          done()
        })
      })
    }) // end run

    describe('_sendMetricData', () => {
      beforeEach((done) => {
        sinon.stub(worker.log, 'trace').resolves()
        sinon.stub(monitorDog, 'increment').resolves()
        done()
      })

      afterEach((done) => {
        monitorDog.increment.restore()
        done()
      })

      it('should log and increment counter', (done) => {
        worker._sendMetricData()
        sinon.assert.calledOnce(worker.log.trace)
        sinon.assert.calledWith(worker.log.trace, '_sendMetricData')
        sinon.assert.calledOnce(monitorDog.increment)
        sinon.assert.calledWith(monitorDog.increment, 'task.create')
        done()
      })
    }) // end _sendMetricData

    describe('_publishEvent', () => {
      beforeEach((done) => {
        sinon.stub(worker.log, 'trace').resolves()
        sinon.stub(publisher, 'publishEvent').resolves()
        done()
      })

      afterEach((done) => {
        publisher.publishEvent.restore()
        done()
      })
      it('should log and publish event', (done) => {
        worker._publishEvent()
        sinon.assert.calledOnce(worker.log.trace)
        sinon.assert.calledWith(worker.log.trace, '_publishEvent')
        sinon.assert.calledOnce(publisher.publishEvent)
        sinon.assert.calledWith(publisher.publishEvent, 'task.created', {
          id: '1234'
        })
        done()
      })
    }) // end _publishEvent
  }) // end methods
})
