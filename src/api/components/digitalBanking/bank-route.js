const express = require('express');
const bankControllers = require('./bank-controller');
const celebrate = require('../../../core/celebrate-wrappers');
const BankValidator = require('./bank-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/bank', route);

  //menampilkan seluruh data
  route.get('/data', bankControllers.getData);

  //membuat pocket baru
  route.post(
    '/create',
    celebrate(BankValidator.createPocket),
    bankControllers.createPocket
  );

  //update jika ada penambahan atau pengurangan uang
  route.put(
    '/:pocketNo/moneyAmmount',
    celebrate(BankValidator.updatePocket),
    bankControllers.updateMoney
  );
};
