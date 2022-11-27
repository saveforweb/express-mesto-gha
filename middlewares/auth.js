const jwt = require('jsonwebtoken');
const errorsList = require('../errors/index');

const { tokenString = 'fcf58399f279c73d80340f6b2d4ce122b64ee01f070b4ac3f911d119d0ab608b' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new errorsList.UnauthorizedError('Необходима авторизация.');
  }

  let payload;

  try {
    payload = jwt.verify(token, tokenString);
  } catch (err) {
    throw new errorsList.UnauthorizedError('Необходима авторизация.');
  }

  req.user = payload;

  return next();
};
