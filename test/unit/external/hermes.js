'use strict'
require('loadenv')()

const Lab = require('lab')
const Code = require('code')
const Hermes = require('runnable-hermes')
const sinon = require('sinon')

const HermesWrap = require('../../../lib/external/hermes.js')

const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('hermes.js unit test', function () {
  beforeEach(function (done) {
    process.env.RABBITMQ_HOSTNAME = 'Goblins'
    process.env.RABBITMQ_PASSWORD = 'Orcs'
    process.env.RABBITMQ_PORT = '1738'
    process.env.RABBITMQ_USERNAME = 'Azog'
    process.env.APP_NAME = 'Padme'
    done()
  })

  afterEach(function (done) {
    delete process.env.RABBITMQ_HOSTNAME
    delete process.env.RABBITMQ_PASSWORD
    delete process.env.RABBITMQ_PORT
    delete process.env.RABBITMQ_USERNAME
    delete process.env.APP_NAME
    done()
  })

  describe('constructor', function () {
    var testClient = { pubish: sinon.stub() }
    var onStub = { on: null }
    beforeEach(function (done) {
      onStub.on = sinon.stub().returns(testClient)
      sinon.stub(Hermes, 'hermesSingletonFactory').returns(onStub)
      done()
    })

    afterEach(function (done) {
      Hermes.hermesSingletonFactory.restore()
      done()
    })

    it('should return promised client', function (done) {
      const hermes = new HermesWrap()
      expect(hermes).to.equal(testClient)
      sinon.assert.calledOnce(Hermes.hermesSingletonFactory)
      sinon.assert.calledWith(Hermes.hermesSingletonFactory, {
        name: process.env.APP_NAME,
        hostname: process.env.RABBITMQ_HOSTNAME,
        port: process.env.RABBITMQ_PORT,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD
      })
      done()
    })

    it('should not allow bad keys', function (done) {
      let hermes
      expect(() => {
        hermes = new HermesWrap({
          dark: 'side'
        })
      }).to.throw()
      expect(hermes)
      done()
    })

    it('should attach error', function (done) {
      const hermes = new HermesWrap()
      expect(hermes).to.equal(testClient)
      sinon.assert.calledOnce(onStub.on)
      sinon.assert.calledWith(onStub.on, 'error', HermesWrap._handleFatalError)
      done()
    })
  }) // end constructor
}) // end hermes.js unit test
