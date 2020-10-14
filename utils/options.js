require('dotenv').config();
const { cleanSpaces } = require('./utils');

const { JWT_SECRET, NODE_ENV } = process.env;

const fieldsToClean = ['name', 'about', 'link', 'avatar', 'email'];

module.exports.jwtSecret =
  (NODE_ENV === 'production' && JWT_SECRET) || 'dev-jwt-secret';

module.exports.bodyParserOptions = {
  reviver: (key, value) => {
    if (fieldsToClean.includes(key)) {
      return cleanSpaces(value);
    }
    return value;
  },
};

module.exports.helmetCSPOptions = {
  directives: {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'font-src': ["'self'"],
    'style-src': ["'self'"],
    'object-src': ["'none'"],
  },
};
