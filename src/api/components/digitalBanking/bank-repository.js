const { Bank } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getAllBankData() {
  return Bank.find({});
}

/**
 * membuat pocket baru
 * @param {string} pocketNo - nomor pocket
 * @param {string} ownerName - pemiliki pocket
 * @param {string} otherOwner - pemilik poket selain main owner
 * @param {string} pocketName - nama pocket
 * @param {string} pocketType - jenis pocket (personal /shared)
 * @param {string} moneyAmmount - jumlah uang di pocket
 * @param {string} PIN - pin
 * @returns {Promise}
 */
async function createNewPocket(
  pocketNo,
  ownerName,
  otherOwner,
  pocketName,
  pocketType,
  moneyAmmount,
  PIN
) {
  return Bank.create({
    pocketNo,
    ownerName,
    otherOwner,
    pocketName,
    pocketType,
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
  const Unik = await Bank.find({ pocketNo: pocketNo });

  if (Unik.length > 0) {
    return true;
  }

  return false;
}

/**
 * Untuk update moneyAmmount
 * @param {string} pocketNo - nomor pocket
 * @param {string} money - moneyAmmount baru
 * @returns {Promise}
 */
async function updateMoney(pocketNo, money) {
  return Bank.updateOne(
    { pocketNo: pocketNo },
    { $set: { moneyAmmount: money } }
  );
}

/**
 * Untuk delete pocket
 * @param {string} pocketNo - nomor pocket
 * @returns {Promise}
 */
async function deletePocket(pocketNo) {
  return Bank.deleteOne({ pocketNo: pocketNo });
}

module.exports = {
  getAllBankData,
  createNewPocket,
  pocketNoUnique,
  updateMoney,
  deletePocket,
};
