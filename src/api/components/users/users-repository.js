const { split, first, last } = require('lodash');
const { User } = require('../../../models');
/**
 * Get a list of users
 * @returns {Promise}
 */

async function TotalData() {
  return User.find({});
}

async function getUsers(awal, pageSize, searching, sorting) {
  //saat search
  const dataSearch = split(searching, ':'); //untuk memecah data
  const dataSatuSearch = first(dataSearch); //field
  const dataDuaSearch = last(dataSearch); //substring

  //saat sort
  const dataSort = split(sorting, ':');
  const dataSatuSort = first(dataSort);
  const dataDuaSort = last(dataSort);
  let ascdesc = 1;
  if (dataDuaSort == 'desc') {
    ascdesc = -1;
  }

  return User.find({
    [dataSatuSearch]: { $regex: `\\b${dataDuaSearch}\\b`, $options: 'i' },
  })
    .sort({ [dataSatuSort]: ascdesc })
    .skip(awal)
    .limit(pageSize)
    .select('-password');
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
