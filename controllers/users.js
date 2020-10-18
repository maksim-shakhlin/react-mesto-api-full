const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  jwtSecret,
  SALT_LENGTH,
  jwtCookieOptions,
  jwtOptions,
} = require('../utils/options');

const { enableErrorHandling } = require('../utils/error-handling');
const {
  Err,
  WRONG_EMAIL_OR_PASSWORD,
  NO_SUCH_USER_ID,
  USER_EXISTS,
  FORBIDDEN,
} = require('../utils/errors');

const User = require('../models/user');
const { cleanCreated } = require('../utils/utils');

const getUsers = (req, res) => {
  return User.find({}).then((users) => res.send(users));
};

const getUser = (req, res) => {
  return User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new Err(NO_SUCH_USER_ID);
    }
    res.send(user);
  });
};

const getUserById = (req, res) => {
  return User.findById(req.params.id).then((user) => {
    if (!user) {
      throw new Err(NO_SUCH_USER_ID);
    }
    res.send(user);
  });
};

const createUser = (req, res) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Err(USER_EXISTS);
      }
    })
    .then(() =>
      bcrypt
        .hash(password, SALT_LENGTH)
        .then((hash) => User.create({ email, password: hash }))
        .then((user) => {
          res.status(201).send(cleanCreated(user, '__v', 'password'));
        }),
    );
};

const updateUser = (res, id, data) => {
  return User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).then((user) => res.send(user));
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  return updateUser(res, req.user._id, { name, about });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return updateUser(res, req.user._id, { avatar });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Err(WRONG_EMAIL_OR_PASSWORD);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Err(WRONG_EMAIL_OR_PASSWORD);
        }

        const token = jwt.sign({ _id: user._id }, jwtSecret, jwtOptions);
        res
          .cookie('jwt', token, jwtCookieOptions)
          .send({ message: 'Вы успешно авторизовались' });
      });
    });
};

const logout = (req, res) => {
  const { _id } = req.body;
  if (_id !== req.user._id) {
    throw new Err(FORBIDDEN);
  }
  return User.findById(_id).then((user) => {
    if (!user) {
      throw new Err(NO_SUCH_USER_ID);
    }
    res.clearCookie('jwt').send({ message: 'Вы успешно вышли' });
  });
};

module.exports = enableErrorHandling({
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  logout,
});
