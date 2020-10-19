const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Err, UNAUTHORIZED } = require('../utils/errors');

const { jwtSecret } = require('../utils/options');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new Err(UNAUTHORIZED));
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    next(new Err(UNAUTHORIZED));
  }

  // in case we have deleted user but he still has cookie
  User.findById(payload)
    .then((user) => {
      if (!user) {
        res.clearCookie('jwt');
        next(new Err(UNAUTHORIZED));
      } else {
        req.user = payload;
        next();
      }
    })
    .catch(next);
};
