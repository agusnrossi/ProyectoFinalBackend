const { MongoClient } = require('mongodb');
const config = require('../../../config/config');

class MongoDBClient {

  static #connection;

  static async getConnection() {
    try {
      if (!this.#connection) {
        this.#connection = await MongoClient.connect(config.mongodb.connectTo('ecommerce'))
      }
      return this.#connection;
    }
    catch (error) {
      throw error
    }
  }

}

module.exports = MongoDBClient;