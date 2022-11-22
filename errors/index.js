const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');
const InternalServerError = require('./InternalServerError');
const UnauthorizedError = require('./UnauthorizedError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');

const errorsList = {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
};

module.exports = errorsList;
