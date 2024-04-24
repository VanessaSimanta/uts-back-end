const bankService = require('./bank-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { response } = require('express');

/**
 * function untuk mendapat semua data
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getData(req, res, next) {
  try {
    const data = await bankService.getData();

    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

/**
 * membuat pocket baru
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createPocket(req, res, next) {
  try {
    const pocketNo = req.body.pocketNo;
    const ownerName = req.body.ownerName;
    const pocketName = req.body.pocketName;
    const moneyAmmount = req.body.moneyAmmount; //jumlah uang yg di transfer user saat membuat pocket baru
    const PIN = req.body.PIN;
    const confirmPin = req.body.confirmPin;

    // cek kesamaan pin
    if (PIN !== confirmPin) {
      throw errorResponder(
        errorTypes.INVALID_PIN,
        'confirm Pin yang diinput berbeda dengan PIN. Silahkan input ulang !'
      );
    }
    // pocketNo harus unique
    const pocketNoUnique = await bankService.pocketNoUnique(pocketNo);
    if (pocketNoUnique) {
      throw errorResponder(
        errorTypes.POCKETNO_ALREADY_EXIST,
        'pocket no sudah ada. silahkan coba lagi dengan pocket no yang berbeda'
      );
    }

    const berhasilCreatePocket = await bankService.createPocket(
      pocketNo,
      ownerName,
      pocketName,
      moneyAmmount,
      PIN
    );
    //jika gagal maka keluarkan error
    if (!berhasilCreatePocket) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Gagal untuk create pocket silahkan coba kembali !'
      );
    }

    return res.status(200).json({ pocketNo, pocketName });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getData,
  createPocket,
};
