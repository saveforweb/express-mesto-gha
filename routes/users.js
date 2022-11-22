const router = require('express').Router();

const {
  getUsers, getUser, updateInfoUser, updateAvatarUser, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', updateInfoUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
