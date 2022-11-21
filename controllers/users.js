const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.message === 'Illegal arguments: undefined, number') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.message });
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
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'ValidationError') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
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
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'ValidationError') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.name });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, 'fcf58399f279c73d80340f6b2d4ce122b64ee01f070b4ac3f911d119d0ab608b', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res
        .status(errorCodes.unauthorized)
        .send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        res.status(errorCodes.notFound).send({ message: 'Пользователь не найден.' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.message });
      }
    });
};
