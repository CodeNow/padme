'use strict'
require('loadenv')()

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const Code = require('code')
const expect = Code.expect

const Hermes = require('runnable-hermes')
const Promise = require('bluebird')
const sinon = require('sinon')

const publisher = require('../../../lib/external/publisher.js')

describe('publisher.js unit test', function () {
  beforeEach(function (done) {
    process.env.RABBITMQ_HOSTNAME = 'Goblins'
    process.env.RABBITMQ_PASSWORD = 'Orcs'
    process.env.RABBITMQ_PORT = '1738'
    process.env.RABBITMQ_USERNAME = 'Azog'
    done()
  })

  afterEach(function (done) {
    delete process.env.RABBITMQ_HOSTNAME
    delete process.env.RABBITMQ_PASSWORD
    delete process.env.RABBITMQ_PORT
    delete process.env.RABBITMQ_USERNAME
    done()
  })

  describe('constructor', function () {
    it('should _publisher', function (done) {
      expect(publisher._publisher).to.be.an.instanceOf(Hermes)
      done()
    })
  }) // end constructor

  describe('start', function () {
    beforeEach(function (done) {
      sinon.stub(publisher._publisher, 'connectAsync')
      done()
    })

    afterEach(function (done) {
      publisher._publisher.connectAsync.restore()
      done()
    })

    it('should run connect', function (done) {
      publisher._publisher.connectAsync.returns(Promise.resolve())

      publisher.start().asCallback(() => {
        sinon.assert.calledOnce(publisher._publisher.connectAsync)
        done()
      })
    })
  }) // end start

  describe('publishEventTested', function () {
    beforeEach(function (done) {
      sinon.stub(publisher._publisher, 'publish')
      done()
    })

    afterEach(function (done) {
      publisher._publisher.publish.restore()
      done()
    })

    it('should throw for invalid data', function (done) {
      expect(() => {
        publisher.publishEventTested({})
      }).to.throw()
      done()
    })

    it('should call publish', function (done) {
      var testData = { id: 'data' }
      publisher.publishEventTested(testData)
      sinon.assert.calledOnce(publisher._publisher.publish)
      sinon.assert.calledWith(publisher._publisher.publish, 'event.tested', testData)
      done()
    })
  }) // end publishEventTested

  describe('publishQueueTest', function () {
    beforeEach(function (done) {
      sinon.stub(publisher._publisher, 'publish')
      done()
    })

    afterEach(function (done) {
      publisher._publisher.publish.restore()
      done()
    })

    it('should throw for invalid data', function (done) {
      expect(() => {
        publisher.publishQueueTest({})
      }).to.throw()
      done()
    })

    it('should call publish', function (done) {
      var testData = { msg: 'data' }
      publisher.publishQueueTest(testData)
      sinon.assert.calledOnce(publisher._publisher.publish)
      sinon.assert.calledWith(publisher._publisher.publish, 'queue.test', testData)
      done()
    })
  }) // end publishQueueTest
}) // end publisher.js unit test
