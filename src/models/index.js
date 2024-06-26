const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const bankSchema = require('./bank-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000,
  },
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Bank = mongoose.model('bank', mongoose.Schema(bankSchema));

module.exports = {
  mongoose,
  User,
  Bank,
};
