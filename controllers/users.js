const User = require('../models/user');
const { errorCodes } = require('../utils/errorCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(errorCodes.internalServerError).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(errorCodes.notFound).send({ message: 'Пользователь не найден.' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorCodes.notFound).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorCodes.notFound).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.name });
      }
    });
};

module.exports.updateInfoUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorCodes.notFound).send({ message: 'Пользователь не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(errorCodes.notFound).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.name });
      }
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorCodes.notFound).send({ message: 'Пользователь не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.name });
      }
    });
};
