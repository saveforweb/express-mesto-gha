const router = require('express').Router();

const {
  getUsers, getUser, createUser, updateInfoUser, updateAvatarUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateInfoUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
