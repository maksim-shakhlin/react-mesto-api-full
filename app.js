require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors: celebrateErrors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
const cors = require('./middlewares/cors');

const users = require('./routes/users');
const cards = require('./routes/cards');
const notFound = require('./routes/notFound');

const {
  bodyParserOptions,
  helmetOptions,
  mongoUri,
  mongooseOptions,
  limiterOptions,
} = require('./utils/options');
const {
  signupValidator,
  signinValidator,
  jsonValidator,
  logoutValidator,
} = require('./middlewares/request-validators');

const limiter = rateLimit(limiterOptions);

const { PORT = 3000, MODIFIER } = process.env;

const app = express();

mongoose.connect(mongoUri, mongooseOptions);

app.use(cors);
app.options('*', cors);

app.use(requestLogger);
app.use(limiter);

app.use(jsonValidator);

app.use(bodyParser.json(bodyParserOptions));
app.use(cookieParser());

app.use(helmet.contentSecurityPolicy(helmetOptions));

if (MODIFIER === 'study') {
  app.get('/crash-test', () => {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  });
}

app.post('/signin', signinValidator, login);
app.post('/signup', signupValidator, createUser);

app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.post('/logout', auth, logoutValidator, logout);

app.use('*', notFound);

app.use(errorLogger);

app.use(celebrateErrors());
app.use(errors);

app.listen(PORT);
