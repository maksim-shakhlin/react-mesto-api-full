const users = require('express').Router();
const { celebrate } = require('celebrate');

const { id, avatar, info } = require('../utils/validation');

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

users.patch('/me/avatar', celebrate(avatar), updateUserAvatar);
users.patch('/me', celebrate(info), updateUserInfo);
users.get('/:id', celebrate(id), getUserById);
users.get('/', getUsers);

module.exports = users;
