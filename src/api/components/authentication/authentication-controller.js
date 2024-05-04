const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

//inisialisasi variabel
let counterLoginAttempt = 0;

/** mengreset counter kembali ke 0
 * @returns {integer}
 */
function resetCounter() {
  counterLoginAttempt = 0;
  return counterLoginAttempt;
}

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;
  const delayTime = 1800000; //waktu timeout 30 menit

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    //jika login attempt lebih dari 5x maka timeout dan error
    if (counterLoginAttempt == 5) {
      setTimeout(resetCounter, delayTime); //setelah timeout selesai maka akan reset counter
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts'
      );
    }

    if (!loginSuccess) {
      //agar dapat mengetahui berapa kali login gagal
      counterLoginAttempt += 1;
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    //saat login success counter reset ke 0
    if (loginSuccess) {
      resetCounter();
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
