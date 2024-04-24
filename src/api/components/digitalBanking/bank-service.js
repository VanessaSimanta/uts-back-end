const bankRepository = require('./bank-repository');
const { hashPassword } = require('../../../utils/password');

/**
 * mendapatkan semua data kecuali pin untuk menjaga keamanan user
 * @returns {Array}
 */
async function getAllData() {
  const SemuaData = await bankRepository.getAllData();
  const hasilData = [];
  for (let i = 0; i < SemuaData.length; i += 1) {
    const Bank = SemuaData[i];
    hasilData.push({
      pocketNo: Bank.pocketNo,
      ownerName: Bank.ownerName,
      otherOwner: Bank.otherOwner,
      pocketName: Bank.pocketName,
      pocketType: Bank.pocketType,
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

  if (unique == true) {
    return true;
  }

  return false;
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
 * @returns {boolean}
 */
async function createPocket(
  pocketNo,
  ownerName,
  otherOwner,
  pocketName,
  pocketType,
  moneyAmmount,
  PIN
) {
  // Hash pin
  const hashedPin = await hashPassword(PIN);

  try {
    await bankRepository.createPocket(
      pocketNo,
      ownerName,
      otherOwner,
      pocketName,
      pocketType,
      moneyAmmount,
      hashedPin
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * untuk mengupdate nominal uang
 * @param {string} pocketNo - nomor pocket
 * @param {string} money - data uang baru
 * @returns {boolean}
 */
async function updateMoney(pocketNo, money) {
  //update money
  try {
    await bankRepository.updateMoney(pocketNo, money);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * untuk delete pocket
 * @param {string} pocketNo - nomor pocket
 * @returns {boolean}
 */
async function deletePocket(pocketNo) {
  try {
    await bankRepository.deletePocket(pocketNo);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getAllData,
  createPocket,
  pocketNoUnique,
  updateMoney,
  deletePocket,
};
