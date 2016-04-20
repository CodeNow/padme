'use strict'
require('loadenv')()

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var afterEach = lab.afterEach
var beforeEach = lab.beforeEach
var Code = require('code')
var expect = Code.expect

var Hermes = require('runnable-hermes')

var subscriber = require('../../../lib/external/subscriber.js')

describe('subscriber.js unit test', function () {
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
    it('should be hermes client', function (done) {
      expect(subscriber).to.be.an.instanceof(Hermes)
      done()
    })
  }) // end constructor
}) // end subscriber.js unit test
