const Card = require('../models/card');
const { errorCodes } = require('../utils/errorCodes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(errorCodes.internalServerError).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.name });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(errorCodes.notFound).send({ message: 'Карточка не найдена.' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(errorCodes.notFound).send({ message: 'Карточка не найдена.' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(errorCodes.notFound).send({ message: 'Карточка не найдена.' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorCodes.badRequest).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(errorCodes.internalServerError).send({ message: err.message });
      }
    });
};
