const bankRepository = require('./bank-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { ownerName, pocketNo } = require('../../../models/bank-schema');

/**
 * mendapatkan semua data
 * @returns {Array}
 */
async function getData() {
  const data = await bankRepository.getData();
  const hasilData = [];
  for (let i = 0; i < data.length; i += 1) {
    const Bank = data[i];
    hasilData.push({
      pocketNo: Bank.pocketNo,
      ownerName: Bank.ownerName,
      pocketName: Bank.pocketName,
      moneyAmmount: Bank.moneyAmmount,
    });
  }

  return hasilData;
}

/**
 * mengecek adanya pocketNo yang sama di database
 * @param {string} pocketNo - nomor pocket
 * @returns {boolean}
 */
async function pocketNoUnique(pocketNo) {
  const unique = await bankRepository.pocketNoUnique(pocketNo);
  if (unique) {
    return true;
  }

  return false;
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
  // Hash pin
  const hashedPin = await hashPassword(PIN);
  try {
    await bankRepository.createPocket(
      pocketNo,
      ownerName,
      pocketName,
      moneyAmmount,
      hashedPin
    );
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getData,
  createPocket,
  pocketNoUnique,
};
