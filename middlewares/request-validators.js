const { celebrate, Joi } = require('celebrate');
const { isUrl, isName, isPassword } = require('../utils/validators');

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

const _id = Joi.string().length(24).hex();
const str = Joi.string().required().min(2).max(30);

const avatar = {
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isUrlJoi),
  }),
};

const info = {
  body: Joi.object().keys({
    name: str.custom(isNameJoi),
    about: str,
  }),
};

const id = {
  params: Joi.object().keys({
    id: _id,
  }),
};

const card = {
  body: Joi.object().keys({
    name: str,
    link: Joi.string().required().custom(isUrlJoi),
  }),
};

const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).custom(isPasswordJoi),
  }),
};

const logout = {
  body: Joi.object().keys({
    _id,
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
  avatarValidator: celebrate(avatar),
  infoValidator: celebrate(info),
  idValidator: celebrate(id),
  cardValidator: celebrate(card),
  signupValidator: celebrate(signup),
  signinValidator: celebrate(signin),
  jsonValidator: celebrate(json),
  logoutValidator: celebrate(logout),
};
