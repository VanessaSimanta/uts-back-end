const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

//inisialisasi variabel
let counterLoginAttempt = 0;

function resetCounter() {
  counterLoginAttempt = 0;
  return counterLoginAttempt;
}

async function login(request, response, next) {
  const { email, password } = request.body;
  const delayTime = 1800000;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    //jika login attempt lebih dari 5x maka timeout dan error
    if (counterLoginAttempt == 5) {
      setTimeout(resetCounter, delayTime);
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts'
      );
    }

    if (!loginSuccess) {
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
