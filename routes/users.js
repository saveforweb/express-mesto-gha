const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getUsers, getUser, updateInfoUser, updateAvatarUser, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', celebrate(
  {
    [Segments.PARAMS]: Joi.object({
      id: Joi.alternatives().try(
        Joi.string().equal('me'),
        Joi.string().hex().length(24),
      ).required(),
    }).required(),
  },
), getUser);

router.patch('/me', updateInfoUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
