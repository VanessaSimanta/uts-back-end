const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @param {integer} pageNumber - page keberapa
 * @param {integer} pageSize - tiap page ada berapa data
 * @param {String} searching - data yang ingin dicari di databasse
 * @param {String} sorting - menentukan urutan data asc /desc
 * @returns {Array}
 */
async function getUsers(pageNumber, pageSize, searching, sorting) {
  //menampung data hasil pagination
  const hasilPagination = {};
  const batasAwal = (pageNumber - 1) * pageSize;
  const batasAkhir = pageNumber * pageSize;
  const apaAja = await usersRepository.TotalData();
  const Count = apaAja.length;
  const semuaPages = Math.ceil(Count / pageSize);

  //memasukkan data hasil pagination ke array
  hasilPagination.page_number = {
    pageNumber,
  };

  hasilPagination.page_size = {
    pageSize,
  };

  hasilPagination.count = {
    Count,
  };

  hasilPagination.totalHal = {
    semuaPages,
  };

  //untuk cek ada previous page atau tidak
  if (batasAwal == 0 || pageNumber == 0) {
    hasilPagination.has_previous_page = {
      has_previous_page: false,
    };
  } else {
    hasilPagination.has_previous_page = {
      has_previous_page: true,
    };
  }

  //untuk cek ada next page atau tidak
  if (batasAkhir > Count || pageNumber == 0) {
    hasilPagination.has_next_page = {
      has_next_page: false,
    };
  } else {
    hasilPagination.has_next_page = {
      has_next_page: true,
    };
  }

  hasilPagination.data = await usersRepository.getUsers(
    batasAwal,
    pageSize,
    searching,
    sorting
  );

  //membuat output
  let hasilPalingAkhir = {
    'Page_number ': hasilPagination.page_number.pageNumber,
    'Page_size': hasilPagination.page_size.pageSize,
    'Count': hasilPagination.count.Count,
    'Total_pages': hasilPagination.totalHal.semuaPages,
    'Has_previous_pages': hasilPagination.has_previous_page.has_previous_page,
    'Has_next_pages': hasilPagination.has_next_page.has_next_page,
    'Data': hasilPagination.data,
  };

  return hasilPalingAkhir;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
