const { Joi } = require('celebrate');

function isUrl(string) {
  const regExp = /^https?:\/\/(www\.)?([\w-]{1,}\.){1,}[a-z]{1,}(\/.*)*$/i;
  return regExp.test(string);
}

function isPassword(string) {
  const regExp = /^[\w!@#$%^&*()\-+=;:,./?\\|`~[\]{}<>"']*$/i;
  return regExp.test(string);
}

function isName(string) {
  const regExp = /^[a-zА-яё\s-]{1,}$/i;
  return regExp.test(string);
}

function decorateForJoi(func, message) {
  return (value, helpers) => {
    if (!func(value)) {
      return helpers.message(message);
    }
    return value;
  };
}

const isUrlJoi = decorateForJoi(isUrl, 'Некорректная ссылка');
const isNameJoi = decorateForJoi(
  isName,
  'Можно только буквы, пробелы и дефисы',
);
const isPasswordJoi = decorateForJoi(
  isPassword,
  'Можно латинские буквы, цифры и любые спецсимволы',
);

const avatar = {
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isUrlJoi),
  }),
};

const info = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).custom(isNameJoi),
    about: Joi.string().required().min(2).max(30),
  }),
};

const id = {
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
};

const card = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(isUrlJoi),
  }),
};

const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).custom(isPasswordJoi),
  }),
};

const signin = signup;

const json = {
  headers: Joi.object()
    .keys({
      'content-type': 'application/json',
    })
    .unknown(true),
};

module.exports = {
  isUrl,
  isName,
  avatar,
  info,
  id,
  card,
  signup,
  signin,
  json,
};
