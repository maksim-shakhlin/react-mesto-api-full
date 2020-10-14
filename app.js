require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, errors: celErrors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');

const users = require('./routes/users');
const cards = require('./routes/cards');
const notFound = require('./routes/notFound');

const { bodyParserOptions, helmetCSPOptions } = require('./utils/options');
const { signup, signin, json } = require('./utils/validation');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
});

const { PORT = 3000, NODE_ENV } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(limiter);

app.use(bodyParser.json(bodyParserOptions));
app.use(cookieParser());

app.use(helmet.contentSecurityPolicy(helmetCSPOptions));

if (NODE_ENV === 'study') {
  app.get('/crash-test', () => {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  });
}

app.use(celebrate(json));
app.post('/signin', celebrate(signin), login);
app.post('/signup', celebrate(signup), createUser);

app.use(auth);

app.use('/users', users);
app.use('/cards', cards);
app.use('*', notFound);

app.use(errorLogger);

app.use(celErrors());
app.use(errors);

app.listen(PORT);
