const jwt = require('jsonwebtoken');
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

  req.user = payload;

  next();
};
