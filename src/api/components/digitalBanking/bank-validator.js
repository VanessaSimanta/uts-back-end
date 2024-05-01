const joi = require('joi');

module.exports = {
  createNewPocket: {
    body: {
      pocketNo: joi.string().min(12).max(12).required().label('PocketNo'),
      ownerName: joi.string().min(1).max(150).required().label('OwnerName'),
      otherOwner: joi.string().min(1).max(300).label('OwnerName'),
      pocketName: joi.string().min(1).max(50).required().label('PocketName'),
      pocketType: joi
        .string()
        .min(1)
        .max(7)
        .valid('Personal', 'Shared')
        .required()
        .label('OwnerName'),
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
  updatePocket: {
    params: {
      pocketNo: joi.string().min(12).max(12).required().label('PocketNo'),
    },
    body: {
      moneyAmmount: joi
        .string()
        .min(1)
        .max(20)
        .required()
        .label('MoneyAmmount'),
    },
  },
  deletePocket: {
    params: {
      pocketNo: joi.string().min(12).max(12).required().label('PocketNo'),
    },
  },
};
