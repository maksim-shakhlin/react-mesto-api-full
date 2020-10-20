const notFound = require('express').Router();
const { Err, NOT_FOUND } = require('../utils/errors');

notFound.all('/', () => {
  throw new Err(NOT_FOUND);
});

module.exports = notFound;
