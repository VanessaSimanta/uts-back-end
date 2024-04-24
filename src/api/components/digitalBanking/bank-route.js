const express = require('express');
const bankControllers = require('./bank-controller');
const celebrate = require('../../../core/celebrate-wrappers');
const BankValidator = require('./bank-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/bank', route);

  //menampilkan data dalam pocket
  route.get('/', bankControllers.getData);

  route.post(
    '/',
    celebrate(BankValidator.createPocket),
    bankControllers.createPocket
  );
};
