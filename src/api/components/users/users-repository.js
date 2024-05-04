const { split, first, last } = require('lodash');
const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function TotalData() {
  return User.find({});
}

/**
 * Get user dengan pagination dan filtering
 * @param {integer} awal - batas awal untuk pagination
 * @param {integer} pageSize - tiap page ada berapa data
 * @param {String} searching - data yang ingin dicari di databasse
 * @param {String} sorting - menentukan urutan data asc /desc
 */
async function getUsers(awal, pageSize, searching, sorting) {
  //saat search
  const dataSearch = split(searching, ':'); //untuk memecah data
  const dataSatuSearch = first(dataSearch); //field
  const dataDuaSearch = last(dataSearch); //substring

  //saat sort
  const dataSort = split(sorting, ':');
  const dataSatuSort = first(dataSort);
  const dataDuaSort = last(dataSort);

  //menentukkan asscending descending
  let ascdesc = 1;
  if (dataDuaSort == 'desc') {
    ascdesc = -1;
  }

  return (
    User.find({
      //untuk mencari data di database
      [dataSatuSearch]: { $regex: `\\b${dataDuaSearch}\\b`, $options: 'i' },
    })
      //untuk sorting
      .sort({ [dataSatuSort]: ascdesc })
      //untuk pagination
      .skip(awal)
      .limit(pageSize)
      //password tidak perlu ditampilkan untuk privacy dan security
      .select('-password')
  );
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  TotalData,
};
