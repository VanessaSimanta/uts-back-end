const { Bank } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getData() {
  return Bank.find({});
}

/**
 * membuat pocket baru
 * @param {string} pocketNo - nomor pocket
 * @param {string} ownerName - pemiliki pocket
 * @param {string} pocketName - nama pocket
 * @param {string} moneyAmmount - jumlah uang di pocket
 * @param {string} PIN - pin
 * @returns {boolean}
 */
async function createPocket(
  pocketNo,
  ownerName,
  pocketName,
  moneyAmmount,
  PIN
) {
  return Bank.create({
    pocketNo,
    ownerName,
    pocketName,
    moneyAmmount,
    PIN,
  });
}

/**
 * mengecek adanya pocketNo yang sama di database
 * @param {string} pocketNo - nomor pocket
 * @returns {boolean}
 */
async function pocketNoUnique(pocketNo) {
  const data = await Bank.find({ pocketNo: pocketNo });
  if (data.length > 0) {
    return true;
  }
  return false;
}

async function updateMoney(pocketNo, money) {
  return Bank.updateOne(
    { pocketNo: pocketNo },
    { $set: { moneyAmmount: money } }
  );
}

module.exports = {
  getData,
  createPocket,
  pocketNoUnique,
  updateMoney,
};
