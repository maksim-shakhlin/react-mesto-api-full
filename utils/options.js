require('dotenv').config();

const { cleaner } = require('./utils');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.jwtSecret =
  (NODE_ENV === 'production' && JWT_SECRET) || 'dev-jwt-secret';

const fieldsToClean = ['name', 'about', 'link', 'avatar', 'email'];

module.exports.bodyParserOptions = {
  reviver: cleaner(fieldsToClean),
};

module.exports.helmetOptions = {
  directives: {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'font-src': ["'self'"],
    'style-src': ["'self'"],
    'object-src': ["'none'"],
  },
};

module.exports.mongoUri = 'mongodb://localhost:27017/mestodb';

module.exports.mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports.limiterOptions = {
  windowMs: 5 * 60 * 1000,
  max: 50,
};

module.exports.SALT_LENGTH = 10;

module.exports.jwtCookieOptions = {
  maxAge: 3600000 * 24 * 7,
  httpOnly: true,
  sameSite: true,
};

module.exports.jwtOptions = {
  expiresIn: '7d',
};

const whitelist = [
  'https://mesto.deque.ru',
  'http://mesto.deque.ru',
  'https://www.mesto.deque.ru',
  'http://www.mesto.deque.ru',
];

if (NODE_ENV !== 'production') {
  whitelist.push('http://localhost:3001');
}
module.exports.whitelist = whitelist;
module.exports.corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
};
