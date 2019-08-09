class DBConnector {
  constructor() {
    this.instance = null;
  }

  static getInstance() {
    const options = {
      client: 'mysql',
      version: '5.7',
      connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'trongnv',
        database: 'crawl'
      }
    }

    if (this.instance != null)
      return this.instance;
    this.instance = require('knex')(options);
    return this.instance;
  }

}
module.exports = DBConnector;
