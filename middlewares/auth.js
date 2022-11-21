const jwt = require('jsonwebtoken');
const { errorCodes } = require('../utils/errorCodes');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(errorCodes.unauthorized)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'fcf58399f279c73d80340f6b2d4ce122b64ee01f070b4ac3f911d119d0ab608b');
  } catch (err) {
    return res
      .status(errorCodes.unauthorized)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
