const bankService = require('./bank-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * function untuk mendapat semua data
 * @param {object} req - Express req object
 * @param {object} res - Express res object
 * @param {object} next - Express route middlewares
 * @returns {object} Res object or pass an error to the next route
 */
async function getAllData(req, res, next) {
  try {
    const semuaData = await bankService.getAllData();

    return res.status(200).json(semuaData);
  } catch (err) {
    return next(err);
  }
}

/**
 * membuat pocket baru
 * @param {object} req - Express req object
 * @param {object} res - Express res object
 * @param {object} next - Express route middlewares
 * @returns {object} Res object or pass an error to the next route
 */
async function createPocket(req, res, next) {
  try {
    const pocketNo = req.body.pocketNo;
    const ownerName = req.body.ownerName;
    const otherOwner = req.body.otherOwner;
    const pocketName = req.body.pocketName;
    const pocketType = req.body.pocketType;
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
    if (pocketNoUnique == true) {
      throw errorResponder(
        errorTypes.DB_DUPLICATE_CONFLICT,
        'pocket no sudah ada. silahkan coba lagi dengan pocket no yang berbeda'
      );
    }

    const berhasilCreatePocket = await bankService.createPocket(
      pocketNo,
      ownerName,
      otherOwner,
      pocketName,
      pocketType,
      moneyAmmount,
      PIN
    );

    //jika gagal maka keluarkan error
    if (berhasilCreatePocket != true) {
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

/**
 * update nominal uang pada pocket
 * @param {object} req - Express req object
 * @param {object} res - Express res object
 * @param {object} next - Express route middlewares
 * @returns {object} Res object or pass an error to the next route
 */
async function updateMoney(req, res, next) {
  try {
    const money = req.body.moneyAmmount;
    const pocketNo = req.params.pocketNo;

    const pocketNoUnique = await bankService.pocketNoUnique(pocketNo);
    const update = await bankService.updateMoney(pocketNo, money);

    //cek no pocket agar tau pocket mana yang uangnya ingin di update
    if (pocketNoUnique != true) {
      throw errorResponder(
        errorTypes.POCKETNO_DOESNT_EXIST,
        'pocket no tidak ada. silahkan coba lagi dengan pocket no yang berbeda'
      );
    }

    //jika update gagal
    if (update != true) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Gagal untuk update pocket silahkan coba kembali !'
      );
    }

    return res.status(200).json({ pocketNo, money });
  } catch (err) {
    return next(err);
  }
}

/**
 * delete pocket
 * @param {object} req - Express req object
 * @param {object} res - Express res object
 * @param {object} next - Express route middlewares
 * @returns {object} Res object or pass an error to the next route
 */
async function deletePocket(req, res, next) {
  try {
    const pocketNo = req.params.pocketNo;

    const delPocket = await bankService.deletePocket(pocketNo);
    const pocketNoUnique = await bankService.pocketNoUnique(pocketNo);

    //cek no pocket agar tau pocket mana yang akan di delete
    if (pocketNoUnique != true) {
      throw errorResponder(
        errorTypes.POCKETNO_DOESNT_EXIST,
        'pocket no tidak ada. silahkan coba lagi dengan pocket no yang berbeda'
      );
    }

    //jika gagal
    if (delPocket != true) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Gagal untuk delete pocket silahkan coba kembali !'
      );
    }

    return res.status(200).json({ pocketNo });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAllData,
  createPocket,
  updateMoney,
  deletePocket,
};
