const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../utils/options');

const { enableErrorHandling } = require('../utils/error-handling');
const {
  Err,
  WRONG_EMAIL_OR_PASSWORD,
  NO_SUCH_USER_ID,
  USER_EXISTS,
} = require('../utils/errors');

const User = require('../models/user');

const getUsers = (req, res) => {
  return User.find({}).then((users) => res.send(users));
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
        .hash(password, 10)
        .then((hash) => User.create({ email, password: hash }))
        .then((user) => {
          const cleanedUser = { ...user._doc };
          delete cleanedUser.__v;
          res.status(201).send(cleanedUser);
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

        const token = jwt.sign({ _id: user._id }, jwtSecret, {
          expiresIn: '7d',
        });
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
          .end();
        throw new Error(jwtSecret);
      });
    });
};

module.exports = enableErrorHandling({
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
});
