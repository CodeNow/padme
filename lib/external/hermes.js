'use strict'

const defaults = require('101/defaults')
const ErrorCat = require('error-cat')
const hermes = require('runnable-hermes')
const Joi = require('joi')
const Promise = require('bluebird')

const log = require('../logger.js')()

const validOpts = Joi.object({
  publishedEvents: Joi.array().min(1).items(Joi.string()),
  subscribedEvents: Joi.array().min(1).items(Joi.string()),
  queues: Joi.array().min(1).items(Joi.string())
}).min(1)

/**
 * Hermes client
 * @module Hermes
 */
module.exports = class Hermes {
  /**
   * Hermes constructor
   * @param {Object} [opts]                  options for Hermes
   * @param {String} [opts.publishedEvents]  published events
   * @param {String} [opts.subscribedEvents] subscribed events
   * @param {String} [opts.queues]           queues
   * @returns {Hermes} Hermes class
   * @throws {Error} If invalid options passed
   */
  constructor (opts) {
    Joi.assert(opts, validOpts)

    const client = hermes.hermesSingletonFactory(defaults({
      name: process.env.APP_NAME,
      hostname: process.env.RABBITMQ_HOSTNAME,
      port: process.env.RABBITMQ_PORT,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD
    }, opts)).on('error', Hermes._handleFatalError)
    return Promise.promisifyAll(client)
  }

  /**
   * reports errors on clients
   * @throws {Error} If missing data
   */
  static _handleFatalError (err) {
    log.error({ err: err }, 'publisher._handleFatalError')
    throw ErrorCat('publisher error', { err: err })
  }
}
