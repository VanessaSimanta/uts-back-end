const joi = require('joi');

module.exports = {
  createPocket: {
    body: {
      pocketNo: joi.string().min(12).max(12).required().label('PocketNo'),
      ownerName: joi.string().min(1).max(150).required().label('OwnerName'),
      pocketName: joi.string().min(1).max(50).required().label('PocketName'),
      moneyAmmount: joi
        .string()
        .min(1)
        .max(20)
        .required()
        .label('MoneyAmmount'),
      PIN: joi.string().min(6).max(6).required().label('PIN'),
      confirmPin: joi.string().min(6).max(6).required().label('confirmPIN'),
    },
  },
};
