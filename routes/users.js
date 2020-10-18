const users = require('express').Router();

const {
  getUsers,
  getUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const {
  avatarValidator,
  infoValidator,
  idValidator,
} = require('../middlewares/request-validators');

users.patch('/me/avatar', avatarValidator, updateUserAvatar);
users.get('/me', getUser);
users.patch('/me', infoValidator, updateUserInfo);
users.get('/:id', idValidator, getUserById);
users.get('/', getUsers);

module.exports = users;
