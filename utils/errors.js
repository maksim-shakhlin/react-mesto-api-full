class Err extends Error {
  constructor({ message = 'Ошибка сервера', statusCode = 500 }) {
    super(message);
    this.statusCode = statusCode;
  }
}

const WRONG_EMAIL_OR_PASSWORD = {
  message: 'Неправильный логин или пароль',
  statusCode: 401,
};

const UNAUTHORIZED = {
  message: 'Необходима авторизация',
  statusCode: 401,
};

const FORBIDDEN = {
  message: 'У вас нет прав на совершение этой операции',
  statusCode: 403,
};

const NO_SUCH_USER_ID = {
  message: 'Пользователь с таким id не найден',
  statusCode: 404,
};

const NO_SUCH_CARD_ID = {
  message: 'Карточка с таким id не найдена',
  statusCode: 404,
};

const NOT_FOUND = {
  message: 'Запрашиваемый ресурс не найден',
  statusCode: 404,
};

const USER_EXISTS = {
  message: 'Пользователь с таким email уже существует',
  statusCode: 409,
};

module.exports = {
  Err,
  WRONG_EMAIL_OR_PASSWORD,
  NO_SUCH_USER_ID,
  UNAUTHORIZED,
  NO_SUCH_CARD_ID,
  FORBIDDEN,
  USER_EXISTS,
  NOT_FOUND,
};
