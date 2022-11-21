const router = require('express').Router();

const {
  getUsers, getUser, updateInfoUser, updateAvatarUser, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateInfoUser);
router.patch('/me/avatar', updateAvatarUser);
router.get('/me', getCurrentUser);

module.exports = router;
