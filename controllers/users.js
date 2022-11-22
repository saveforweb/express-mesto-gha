const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorsList = require('../errors/index');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new errorsList.NotFoundError('Пользователь не найден.');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new errorsList.BadRequestError('Переданы некорректные данные при запросе пользователя.');
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new errorsList.NotFoundError('Пользователь не найден.');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new errorsList.BadRequestError('Переданы некорректные данные при запросе пользователя.');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
        throw new errorsList.BadRequestError('Переданы некорректные данные при создании пользователя.');
      } else if (err.message === 'Illegal arguments: undefined, number') {
        throw new errorsList.BadRequestError('Переданы некорректные данные при создании пользователя.');
      } else if (err.code === 11000) {
        throw new errorsList.ConflictError('Пользователь с таким email зарегистрован.');
      }
    })
    .catch(next);
};

module.exports.updateInfoUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new errorsList.BadRequestError('Переданы некорректные данные при обновлении профиля.');
      } else if (err.name === 'ValidationError') {
        throw new errorsList.BadRequestError('Переданы некорректные данные при обновлении профиля.');
      }
    })
    .catch(next);
};

module.exports.updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new errorsList.BadRequestError('Переданы некорректные данные при обновлении профиля.');
      } else if (err.name === 'ValidationError') {
        throw new errorsList.BadRequestError('Переданы некорректные данные при обновлении профиля.');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new errorsList.UnauthorizedError('Неправильные почта или пароль.');
      }
      const token = jwt.sign({ _id: user._id }, 'fcf58399f279c73d80340f6b2d4ce122b64ee01f070b4ac3f911d119d0ab608b', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new errorsList.UnauthorizedError('Неправильные почта или пароль.');
      }

      return res.send({ message: 'Всё верно!' });
    })
    .catch(next);
};
