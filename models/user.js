const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { isName, isUrl } = require('../utils/validation');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: isName,
      message: 'Допускаются только буквы, пробелы и дефисы',
    },
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: { validator: isUrl, message: 'Некорректная ссылка' },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: isEmail, message: 'Некорректный email' },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  __v: { type: Number, select: false },
});

module.exports = mongoose.model('user', userSchema);
